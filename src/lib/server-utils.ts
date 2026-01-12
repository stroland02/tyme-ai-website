import { prisma } from "./prisma";

/**
 * Calculate user's current activity streak (consecutive days with activity)
 * Combines workouts and meals from the past year.
 */
export async function calculateStreak(userId: string): Promise<number> {
  try {
    // Get all workouts and meals from the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [workouts, meals] = await Promise.all([
      prisma.workout.findMany({
        where: { userId, createdAt: { gte: oneYearAgo } },
        select: { createdAt: true },
      }),
      prisma.meal.findMany({
        where: { userId, createdAt: { gte: oneYearAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Combine all activity dates and normalize to start of day
    const activityDates = new Set<number>();
    
    workouts.forEach(w => {
      const date = new Date(w.createdAt);
      date.setHours(0, 0, 0, 0);
      activityDates.add(date.getTime());
    });
    
    meals.forEach(m => {
      const date = new Date(m.createdAt);
      date.setHours(0, 0, 0, 0);
      activityDates.add(date.getTime());
    });

    if (activityDates.size === 0) return 0;

    // Sort dates in descending order
    const sortedDates = Array.from(activityDates).sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    // Check if there was activity today or yesterday
    const lastActivityTime = sortedDates[0];
    if (lastActivityTime !== todayTime && lastActivityTime !== yesterdayTime) {
      return 0; // Streak broken
    }

    // Start checking from the most recent activity date
    let currentCheckDate = new Date(lastActivityTime);
    
    for (const activityTime of sortedDates) {
      if (activityTime === currentCheckDate.getTime()) {
        streak++;
        // Move to the day before
        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
      } else {
        // Gap found
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}
