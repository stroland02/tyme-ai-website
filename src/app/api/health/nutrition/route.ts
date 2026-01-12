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
      name, 
      type, 
      calories, 
      protein, 
      carbs, 
      fats, 
      description 
    } = body;

    const meal = await prisma.meal.create({
      data: {
        userId: session.user.id,
        name,
        type: type || 'snack',
        calories: parseInt(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fats) || 0,
        description: description || '',
        logged: true,
      },
    });

    return NextResponse.json(meal);
  } catch (error: any) {
    console.error('Failed to log meal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log meal' },
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
    const meals = await prisma.meal.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return NextResponse.json(meals);
  } catch (error: any) {
    console.error('Failed to fetch meals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}
