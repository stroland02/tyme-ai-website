import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateWorkoutPlan } from '@/lib/gemini';

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
    const { duration, workoutType } = body;

    // Generate AI workout plan
    const workoutPlan = await generateWorkoutPlan({
      fitnessLevel: profile.fitnessLevel,
      goals: profile.user.goals.map((g: any) => g.description || g.type),
      equipment: profile.equipment ? profile.equipment.split(',') : [],
      duration: duration || profile.minutesPerDay,
      workoutType: workoutType || 'strength',
    });

    // Save the AI-generated workout
    const workout = await prisma.workout.create({
      data: {
        userId: session.user.id,
        type: workoutType || 'strength',
        name: workoutPlan.name,
        durationMin: duration || profile.minutesPerDay,
        aiGenerated: true,
        completed: false,
        notes: `Warmup: ${workoutPlan.warmup}\n\nCooldown: ${workoutPlan.cooldown}\n\nTips: ${workoutPlan.tips?.join('\n')}`,
        exercises: {
          create: workoutPlan.exercises.map((ex: any) => ({
            name: ex.name,
            category: 'strength',
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight || 0,
            restTime: ex.rest || 60,
            notes: ex.notes || '',
            completed: false,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return NextResponse.json({
      workout,
      plan: workoutPlan,
    });
  } catch (error: any) {
    console.error('Failed to generate workout:', error);

    // Return helpful error message
    if (error.message?.includes('Gemini AI is not configured')) {
      return NextResponse.json(
        {
          error: 'AI features are not configured yet. Please set up Gemini API key.',
          fallback: {
            message:
              'AI workout generation is currently unavailable. Please log your workout manually.',
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
