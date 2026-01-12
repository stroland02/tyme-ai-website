import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateStreak } from '@/lib/server-utils';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    
    // Check if user has completed onboarding (has a profile)
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete onboarding.' },
        { status: 404 }
      );
    }

    // Get basic stats
    const [streak, totalWorkouts, notificationPrefs] = await Promise.all([
      calculateStreak(userId),
      prisma.workout.count({ where: { userId } }),
      prisma.notificationPreference.findUnique({ where: { userId } })
    ]);

    // Time ranges
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch related data in parallel
    const [weekWorkouts, todayMeals, recentWorkouts, recentMeals, measurements, workoutHistory, upcomingWorkouts] = await Promise.all([
      prisma.workout.count({
        where: { userId, createdAt: { gte: startOfWeek }, completed: true }
      }),
      prisma.meal.findMany({
        where: { userId, createdAt: { gte: startOfDay } }
      }),
      prisma.workout.findMany({
        where: { userId, completed: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { exercises: true }
      }),
      prisma.meal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.measurement.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.workout.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo }, completed: true },
        select: { createdAt: true }
      }),
      prisma.workout.findMany({
        where: { userId, completed: false },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { exercises: true }
      })
    ]);

    // Aggregations
    const todayCalories = todayMeals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0);
    const weeklyGoalWorkouts = profile.weeklyWorkoutGoal || 5;
    const weeklyGoalProgress = Math.min(100, Math.round((weekWorkouts / weeklyGoalWorkouts) * 100));

    // Motivational message
    const motivationalMessage = notificationPrefs?.lastMotivationalMessage || 
      `You're doing great! Keep pushing towards your goals. ${streak} days strong! 💪`;

    // Activity Feed
    const recentActivity = [
      ...recentWorkouts.map(w => ({
        id: w.id,
        type: 'workout' as const,
        title: `${w.type.charAt(0).toUpperCase() + w.type.slice(1)} Workout`,
        description: `${w.durationMin} min • ${w.exercises.length} exercises`,
        timestamp: w.createdAt.toISOString(),
        icon: '🏋️',
      })),
      ...recentMeals.map(m => ({
        id: m.id,
        type: 'meal' as const,
        title: m.name,
        description: `${m.calories} cal • ${m.protein}g P`,
        timestamp: m.createdAt.toISOString(),
        icon: '🍽️',
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    // Weight Chart Data
    const weightHistory = measurements
      .filter(m => m.weight !== null)
      .map(m => ({
        date: new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: m.weight
      }));

    // If no measurements, add starting weight if available
    if (weightHistory.length === 0 && profile.startingWeight) {
      weightHistory.push({
        date: 'Start',
        weight: profile.startingWeight
      });
    }

    // Workout Consistency (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const consistencyData = last7Days.map(date => {
      const hasWorkout = workoutHistory.some(w => {
        const wDate = new Date(w.createdAt);
        wDate.setHours(0, 0, 0, 0);
        return wDate.getTime() === date.getTime();
      });
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: hasWorkout ? 1 : 0
      };
    });

    return NextResponse.json({
      streak,
      totalWorkouts,
      weekWorkouts,
      todayCalories,
      weeklyGoalProgress,
      motivationalMessage,
      currentWeight: measurements[measurements.length - 1]?.weight || profile.startingWeight,
      goalWeight: (await prisma.goal.findFirst({ where: { userId, type: 'weight' } }))?.targetValue,
      recentActivity,
      weightHistory,
      consistencyData,
      upcomingWorkouts: upcomingWorkouts.map(w => ({
        id: w.id,
        name: w.name,
        type: w.type,
        exerciseCount: w.exercises.length,
        createdAt: w.createdAt.toISOString()
      }))
    });

  } catch (error: any) {
    console.error('Failed to load dashboard:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
