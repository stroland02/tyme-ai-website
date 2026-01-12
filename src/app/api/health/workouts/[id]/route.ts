import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: { exercises: true }
    });

    if (!workout || workout.userId !== session.user.id) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { completed, exercises, durationMin } = body;

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        completed: completed !== undefined ? !!completed : undefined,
        durationMin: durationMin !== undefined ? parseInt(durationMin) : undefined,
        exercises: exercises ? {
          update: exercises.map((ex: any) => ({
            where: { id: ex.id },
            data: {
              completed: ex.completed !== undefined ? !!ex.completed : undefined,
              sets: ex.sets !== undefined ? parseInt(ex.sets) : undefined,
              reps: ex.reps !== undefined ? parseInt(ex.reps) : undefined,
              weight: ex.weight !== undefined ? parseFloat(ex.weight) : undefined,
            }
          }))
        } : undefined
      },
      include: { exercises: true }
    });

    return NextResponse.json(workout);
  } catch (error: any) {
    console.error('Update Workout Error:', error);
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}