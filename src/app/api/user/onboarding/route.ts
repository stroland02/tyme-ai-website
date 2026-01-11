import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        age: data.age,
        gender: data.gender,
        heightCm: data.heightCm,
        currentWeight: data.currentWeight,
        fitnessLevel: data.fitnessLevel,
        availableDays: data.availableDays,
        minutesPerDay: data.minutesPerDay,
        dietaryPreference: data.dietaryPreference,
        equipment: data.equipment,
      },
    });

    // Create initial goal
    if (data.primaryGoal) {
      await prisma.goal.create({
        data: {
          userId: session.user.id,
          type: data.primaryGoal,
          description: `Primary goal: ${data.primaryGoal}`,
          targetValue: data.targetWeight || data.currentWeight,
          currentValue: data.currentWeight,
          unit: 'kg',
          deadline: data.deadline ? new Date(data.deadline) : null,
          priority: 1,
        },
      });
    }

    // Create initial measurement record
    await prisma.measurement.create({
      data: {
        userId: session.user.id,
        weight: data.currentWeight,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
