import { prisma } from './prisma';
import OpenAI from 'openai';
import webpush from 'web-push';
import { calculateStreak } from './server-utils';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Configure Web Push (you'll need to generate VAPID keys)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// =====================
// AI MOTIVATION GENERATOR
// =====================

export async function generateMotivationalMessage(userId: string) {
  // Get user context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      goals: { where: { status: 'active' }, take: 3 },
      workouts: { orderBy: { createdAt: 'desc' }, take: 7 },
      measurements: { orderBy: { date: 'desc' }, take: 2 },
    },
  });

  if (!user) return null;

  // Calculate streak using utility function
  const streak = await calculateStreak(userId);

  // Get recent progress
  const recentProgress = user.measurements.length >= 2
    ? {
        weightChange: user.measurements[0].weight && user.measurements[1].weight
          ? user.measurements[0].weight - user.measurements[1].weight
          : null,
        weeksSinceStart: Math.floor(
          (new Date().getTime() - new Date(user.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
        ),
      }
    : null;

  // Check if OpenAI is configured
  if (!openai) {
      console.warn("OpenAI API key not configured. Using fallback message.");
      return {
          title: `Hey ${user.name || 'Champion'}! 💪`,
          body: `You're doing great! Keep pushing towards your goals. ${streak} days strong!`,
          context: { streak, recentWorkouts: user.workouts.length, progress: recentProgress }
      };
  }

  // Build prompt for AI
  const prompt = `You are a motivational fitness coach. Generate a SHORT (2-3 sentences) motivational message for:

User: ${user.name || 'Champion'}
Streak: ${streak} days
Recent workouts: ${user.workouts.length} in past 7 days
Primary goal: ${user.goals[0]?.type || 'general fitness'}
${recentProgress?.weightChange ? `Recent progress: ${Math.abs(recentProgress.weightChange).toFixed(1)}kg ${recentProgress.weightChange < 0 ? 'lost' : 'gained'}` : ''}

Generate a personalized, energetic, actionable message. Use their name. Make it specific to their situation.
Focus on: consistency, progress, and today's actions.
Tone: Supportive but challenging, like a friend who believes in them.
NO generic platitudes. Make it feel personal.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.8,
  });

  const message = response.choices[0].message.content?.trim() || '';

  return {
    title: `Hey ${user.name || 'Champion'}! 💪`,
    body: message,
    context: {
      streak,
      recentWorkouts: user.workouts.length,
      progress: recentProgress,
    },
  };
}

// =====================
// SEND NOTIFICATIONS
// =====================

export async function sendDailyMotivation(userId: string) {
  // Check if user wants daily motivation
  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  if (!prefs || !prefs.dailyMotivation) {
    return { success: false, reason: 'User disabled daily motivation' };
  }

  // Generate message
  const message = await generateMotivationalMessage(userId);
  if (!message) {
    return { success: false, reason: 'Failed to generate message' };
  }

  const results = {
    webPush: false,
    email: false,
    sms: false,
  };

  // Send via Web Push
  if (prefs.enableWebPush) {
    results.webPush = await sendWebPush(userId, message.title, message.body);
  }

  // Send via Email (backup if push fails)
  if (prefs.enableEmail && !results.webPush) {
    results.email = await sendEmail(userId, message.title, message.body);
  }

  // Send via SMS (if enabled and premium)
  if (prefs.enableSMS && prefs.phoneNumber) {
    results.sms = await sendSMS(prefs.phoneNumber, message.body);
  }

  // Log notification
  await prisma.notificationLog.create({
    data: {
      userId,
      type: 'daily_motivation',
      channel: results.webPush ? 'web_push' : results.email ? 'email' : 'sms',
      title: message.title,
      body: message.body,
      status: (results.webPush || results.email || results.sms) ? 'sent' : 'failed',
      sentAt: new Date(),
    },
  });

  // Update last motivational message
  await prisma.notificationPreference.update({
    where: { userId },
    data: {
      lastMotivationalMessage: message.body,
      lastMessageGeneratedAt: new Date(),
    }
  });

  return {
    success: results.webPush || results.email || results.sms,
    channels: results,
    message,
  };
}

// =====================
// WEB PUSH NOTIFICATIONS
// =====================

async function sendWebPush(userId: string, title: string, body: string): Promise<boolean> {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId, active: true },
    });

    if (subscriptions.length === 0) return false;

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        url: '/app/dashboard',
        timestamp: Date.now(),
      },
    });

    const promises = subscriptions.map(async (sub: any) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
        return true;
      } catch (error: any) {
        // If subscription is no longer valid, mark as inactive
        if (error.statusCode === 404 || error.statusCode === 410) {
          await prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { active: false },
          });
        }
        return false;
      }
    });

    const results = await Promise.all(promises);
    return results.some((r) => r === true);
  } catch (error) {
    console.error('Web push error:', error);
    return false;
  }
}

// =====================
// EMAIL NOTIFICATIONS
// =====================

async function sendEmail(userId: string, title: string, body: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.email) return false;

    console.log(`Email would be sent to ${user.email}: ${title}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// =====================
// SMS NOTIFICATIONS (Twilio)
// =====================

async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    console.log(`SMS would be sent to ${phoneNumber}: ${message}`);
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
}

// =====================
// CRON JOB (to be called daily)
// =====================

export async function sendAllDailyMotivations() {
  // Get all users with daily motivation enabled at their preferred time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  const users = await prisma.notificationPreference.findMany({
    where: {
      dailyMotivation: true,
      preferredTime: currentTime, // Simplified - in production, handle timezones properly
    },
    include: {
      user: true,
    },
  });

  console.log(`Sending daily motivation to ${users.length} users at ${currentTime}`);

  const results = await Promise.allSettled(
    users.map((pref: any) => sendDailyMotivation(pref.userId))
  );

  const successful = results.filter((r: any) => r.status === 'fulfilled').length;
  const failed = results.filter((r: any) => r.status === 'rejected').length;

  return {
    total: users.length,
    successful,
    failed,
    timestamp: now.toISOString(),
  };
}