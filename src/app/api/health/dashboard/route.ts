import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user has completed onboarding (has a profile)
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete onboarding.' },
        { status: 404 }
      );
    }

    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        workouts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        meals: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        measurements: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        goals: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate streak
    const streak = await calculateStreak(session.user.id);

    // Count this week's workouts
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekWorkouts = user.workouts.filter(
      (w) => new Date(w.createdAt) >= startOfWeek
    ).length;

    // Calculate today's calories
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCalories = user.meals
      .filter((m) => new Date(m.createdAt) >= startOfDay)
      .reduce((sum, meal) => sum + (meal.calories || 0), 0);

    // Calculate weekly goal progress (based on workout frequency goal)
    const weeklyGoalWorkouts = user.profile?.weeklyWorkoutGoal || 5;
    const weeklyGoalProgress = Math.min(
      100,
      Math.round((weekWorkouts / weeklyGoalWorkouts) * 100)
    );

    // Get motivational message (cached or generate new)
    let motivationalMessage = user.notificationPreferences?.lastMotivationalMessage ||
      `You're doing great! Keep pushing towards your goals. ${streak} days strong! 💪`;

    // Get recent activity (combine workouts and meals)
    const recentActivity = [
      ...user.workouts.slice(0, 5).map((w) => ({
        id: w.id,
        type: 'workout' as const,
        title: `${w.type} Workout`,
        description: `${w.duration} minutes • ${w.exercises?.length || 0} exercises`,
        timestamp: w.createdAt.toISOString(),
        icon: '🏋️',
      })),
      ...user.meals.slice(0, 5).map((m) => ({
        id: m.id,
        type: 'meal' as const,
        title: `${m.type} Meal`,
        description: `${m.calories} calories • ${m.protein || 0}g protein`,
        timestamp: m.createdAt.toISOString(),
        icon: '🍽️',
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    // Get current weight and goal weight
    const currentWeight = user.measurements[0]?.weight || profile.startingWeight;
    const goalWeight = user.goals.find((g) => g.type === 'weight')?.targetValue;

    return NextResponse.json({
      streak,
      totalWorkouts: user.workouts.length,
      weekWorkouts,
      todayCalories,
      weeklyGoalProgress,
      motivationalMessage,
      currentWeight,
      goalWeight,
      recentActivity,
    });
  } catch (error: any) {
    console.error('Failed to load dashboard:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}

// Calculate user's current streak (consecutive days with activity)
async function calculateStreak(userId: string): Promise<number> {
  try {
    // Get all workouts and meals, sorted by date
    const activities = await prisma.$queryRaw<Array<{ date: Date }>>`
      SELECT DISTINCT DATE(created_at) as date
      FROM (
        SELECT created_at FROM workouts WHERE user_id = ${userId}
        UNION ALL
        SELECT created_at FROM meals WHERE user_id = ${userId}
      ) as combined
      ORDER BY date DESC
    `;

    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there's activity today or yesterday (to not break streak)
    const lastActivityDate = new Date(activities[0].date);
    lastActivityDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) {
      return 0; // Streak broken
    }

    // Count consecutive days
    for (let i = 0; i < activities.length; i++) {
      const activityDate = new Date(activities[i].date);
      activityDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (activityDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}
