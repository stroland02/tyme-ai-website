import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMealPlan } from '@/lib/gemini';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { user: { include: { goals: true } } },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { calorieTarget, mealsPerDay = 3 } = body;

    // Calculate calorie target based on goals if not provided
    const targetCalories = calorieTarget || 2000; // Default or calculate based on goals

    // Generate AI meal plan
    const mealPlan = await generateMealPlan({
      dietaryPreference: profile.dietaryPreference,
      goals: profile.user.goals.map((g: any) => g.description || g.type),
      calorieTarget: targetCalories,
      mealsPerDay,
      restrictions: profile.injuries ? [profile.injuries] : [], // Convert string to array
    });

    // Save the meals to database
    const savedMeals = await Promise.all(
      mealPlan.meals.map((meal: any) =>
        prisma.meal.create({
          data: {
            userId: session.user.id,
            name: meal.name,
            type: meal.type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            description: `Ingredients: ${meal.ingredients?.join(', ')}\n\n${meal.instructions}`,
            aiIdentified: true,
            logged: false, // Not logged yet, just a plan
          },
        })
      )
    );

    return NextResponse.json({
      mealPlan,
      savedMeals,
    });
  } catch (error: any) {
    console.error('Failed to generate meal plan:', error);

    if (error.message?.includes('Gemini AI is not configured')) {
      return NextResponse.json(
        {
          error: 'AI features are not configured yet. Please set up Gemini API key.',
          fallback: {
            message:
              'AI meal planning is currently unavailable. Please log your meals manually.',
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
