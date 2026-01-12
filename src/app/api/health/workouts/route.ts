import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      type, 
      name, 
      durationMin, 
      caloriesBurned, 
      notes, 
      userRating, 
      exercises,
      completed = true,
      aiGenerated = false
    } = body;

    // Create the workout with exercises
    const workout = await prisma.workout.create({
      data: {
        userId: session.user.id,
        type: type || 'strength',
        name: name || `${type || 'strength'} Workout`,
        durationMin: parseInt(durationMin) || 0,
        caloriesBurned: parseInt(caloriesBurned) || 0,
        notes: notes || '',
        userRating: parseInt(userRating) || 5,
        completed: !!completed,
        aiGenerated: !!aiGenerated,
        exercises: {
          create: exercises.map((ex: any) => ({
            name: ex.name,
            category: ex.category || 'other',
            sets: parseInt(ex.sets) || 0,
            reps: parseInt(ex.reps) || 0,
            weight: parseFloat(ex.weight) || 0,
            completed: !!completed,
            notes: ex.notes || '',
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return NextResponse.json(workout);
  } catch (error: any) {
    console.error('Failed to create workout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create workout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id },
      include: { exercises: true },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return NextResponse.json(workouts);
  } catch (error: any) {
    console.error('Failed to fetch workouts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}
