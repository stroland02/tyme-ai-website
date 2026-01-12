import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCoachingAdvice } from '@/lib/gemini';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, context } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Get user profile and recent data for context
    const [profile, recentWorkouts, recentMeals] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        include: { user: { include: { goals: true } } },
      }),
      prisma.workout.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { exercises: true },
      }),
      prisma.meal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    if (!profile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 404 }
      );
    }

    // Get AI coaching advice
    const advice = await getCoachingAdvice({
      userProfile: {
        ...profile,
        goals: profile.user.goals,
        recentWorkouts,
        recentMeals,
      },
      question,
      context,
    });

    return NextResponse.json({
      advice,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to get coaching advice:', error);

    if (error.message?.includes('Gemini AI is not configured')) {
      return NextResponse.json(
        {
          error: 'AI Coach is not configured yet. Please set up Gemini API key.',
          advice:
            "I'm currently unavailable, but I'd be happy to help once the AI features are configured!",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to get coaching advice' },
      { status: 500 }
    );
  }
}
