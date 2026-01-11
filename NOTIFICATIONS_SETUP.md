# 🔔 Daily Motivational Notifications - Complete Setup Guide

## Overview

Your health coaching app now has an **AI-powered daily notification system** that sends personalized motivational messages to users through multiple channels:

- 🌐 **Web Push Notifications** (browser alerts - iPhone & PC)
- 📧 **Email Notifications** (backup delivery)
- 📱 **SMS Notifications** (optional premium feature)

---

## How It Works

1. **AI Generates Personalized Messages**
   - Analyzes user's streak, recent workouts, goals, and progress
   - Creates 2-3 sentence motivational message specific to THEM
   - Uses GPT-4 for natural, non-generic messaging

2. **Sends at User's Preferred Time**
   - Users choose their notification time (default: 9:00 AM)
   - Vercel Cron runs every hour
   - Sends to users whose preferred time matches current hour

3. **Multi-Channel Delivery**
   - Primary: Web Push (instant, free)
   - Backup: Email (if push fails or disabled)
   - Premium: SMS (for Elite tier subscribers)

---

## Step 1: Generate VAPID Keys (Web Push)

VAPID keys allow your server to send push notifications to browsers.

```bash
cd tyme-ai-website
npx web-push generate-vapid-keys
```

**Output:**
```
Public Key:  BFDDkYh...longstring...abc123
Private Key: xyz789...longstring...def456
```

### Add to `.env.local`:

```bash
# Web Push (VAPID keys)
VAPID_PUBLIC_KEY="BFDDkYh...your_public_key"
VAPID_PRIVATE_KEY="xyz789...your_private_key"
```

---

## Step 2: Set Up Email Notifications (Resend)

### Create Resend Account

1. Go to: https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Verify your domain (or use `onboarding@resend.dev` for testing)
4. Get API key from: https://resend.com/api-keys

### Add to `.env.local`:

```bash
# Email Notifications
RESEND_API_KEY="re_your_key_here"
```

### Domain Verification (for production)

1. **Add Domain** in Resend Dashboard
   - Domain: `tyme-ai.com`

2. **Add DNS Records** (in GoDaddy):
   - Type: `TXT`
   - Name: `@`
   - Value: (provided by Resend)

3. **Verify Domain** (in Resend)
   - Click "Verify" after DNS propagates (5-30 min)

4. **Update "From" Email**:
   ```typescript
   // In src/lib/notifications.ts
   from: 'TymeHealth Coach <coach@tyme-ai.com>'
   ```

---

## Step 3: Set Up SMS Notifications (Twilio - Optional)

SMS is a **premium feature** for Elite tier subscribers.

### Create Twilio Account

1. Go to: https://www.twilio.com/try-twilio
2. Sign up (free trial: $15 credit)
3. Get a phone number: Console → Phone Numbers → Buy a number
4. Get credentials: Console → Account Info

### Add to `.env.local`:

```bash
# SMS Notifications (Optional)
TWILIO_ACCOUNT_SID="ACxxx...your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890" # Your Twilio number
```

### Pricing

- **Free Trial**: $15 credit (~500 SMS messages)
- **Pay-as-you-go**: $0.0079 per SMS (US)
- **Monthly cost per active user**: ~$0.24 (1 SMS/day)
- **Your Elite tier**: $29.99/month
- **SMS cost**: ~$0.24/month
- **Profit**: Still 99% margin 🎉

---

## Step 4: Set Up Vercel Cron (Auto-Send)

### Configure Cron Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

### Add to `.env.local`:

```bash
CRON_SECRET="your_generated_secret_here"
```

### Vercel Cron Configuration

Already created in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-motivation",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Cron Schedule Explanation:**
- `0 * * * *` = Every hour at :00 minutes
- Example: 9:00 AM, 10:00 AM, 11:00 AM, etc.
- When it's 9:00 AM, all users with `preferredTime: "09:00"` get their notification

**Custom Schedules:**
- `0 9 * * *` = Every day at 9:00 AM (single time)
- `0 9,12,18 * * *` = 9 AM, 12 PM, 6 PM (multiple times)
- `*/15 * * * *` = Every 15 minutes (for testing)

### Add Cron Secret to Vercel

After deploying:
1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `CRON_SECRET` = (your generated secret)
3. Redeploy

---

## Step 5: Test Notifications Locally

### Test AI Message Generation

```bash
# Start dev server
npm run dev

# In another terminal, trigger cron manually
curl -X POST http://localhost:3000/api/cron/daily-motivation
```

**Expected Output:**
```json
{
  "success": true,
  "total": 5,
  "successful": 5,
  "failed": 0,
  "timestamp": "2025-01-11T10:00:00.000Z"
}
```

### Check Logs

```bash
# You should see:
# - "Sending daily motivation to X users at 09:00"
# - "Email would be sent to user@example.com"
# - "SMS would be sent to +1234567890"
```

---

## Step 6: Enable Web Push in Frontend

### Create Push Subscription Component

When users first visit the app, ask for notification permission:

```typescript
// src/app/app/dashboard/page.tsx

useEffect(() => {
  async function requestNotificationPermission() {
    if (!('Notification' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeToPush();
    }
  }

  requestNotificationPermission();
}, []);

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  // Send to backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### Create Service Worker

```javascript
// public/sw.js

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

---

## Step 7: User Notification Preferences UI

### Settings Page

```typescript
// src/app/app/settings/notifications/page.tsx

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    enableWebPush: true,
    enableEmail: true,
    enableSMS: false,
    dailyMotivation: true,
    workoutReminder: true,
    goalMilestone: true,
    preferredTime: '09:00',
    timezone: 'America/New_York',
  });

  const handleSave = async () => {
    await fetch('/api/user/notifications', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notification Preferences</h1>

      {/* Channels */}
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.enableWebPush}
            onChange={(e) => setPrefs({ ...prefs, enableWebPush: e.target.checked })}
          />
          Browser Notifications (Recommended)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.enableEmail}
            onChange={(e) => setPrefs({ ...prefs, enableEmail: e.target.checked })}
          />
          Email Notifications (Backup)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.enableSMS}
            onChange={(e) => setPrefs({ ...prefs, enableSMS: e.target.checked })}
            disabled={!isEliteTier}
          />
          SMS Notifications (Elite only)
        </label>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h2 className="font-bold">What to notify about:</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.dailyMotivation}
            onChange={(e) => setPrefs({ ...prefs, dailyMotivation: e.target.checked })}
          />
          Daily Motivation (Morning message)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.workoutReminder}
            onChange={(e) => setPrefs({ ...prefs, workoutReminder: e.target.checked })}
          />
          Workout Reminders (If you miss a day)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.goalMilestone}
            onChange={(e) => setPrefs({ ...prefs, goalMilestone: e.target.checked })}
          />
          Goal Milestones (When you hit targets)
        </label>
      </div>

      {/* Timing */}
      <div className="space-y-2">
        <label className="font-bold">Preferred notification time:</label>
        <input
          type="time"
          value={prefs.preferredTime}
          onChange={(e) => setPrefs({ ...prefs, preferredTime: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <p className="text-sm text-gray-600">
          Your local time: {prefs.timezone}
        </p>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Save Preferences
      </button>
    </div>
  );
}
```

---

## Example Notification Messages

### Sample AI-Generated Messages

**For a beginner on a 7-day streak:**
> "Sarah! 7 days strong! 🔥 That's a full week of showing up for yourself. Today's leg day - your squats are about to feel SO much easier than last week. Let's keep this momentum rolling!"

**For someone who lost 2kg:**
> "Mike, you're down 2kg in 3 weeks! That's the perfect pace for sustainable fat loss. Your consistency is paying off. Today's workout is your investment in tomorrow's results. Let's go!"

**For someone about to lose their streak:**
> "Hey Jordan! Your 23-day streak is on the line today. I know life's busy, but even a 10-minute workout counts. Don't let today be the day that breaks the chain! You got this 💪"

**For an advanced athlete:**
> "Beast mode activated! 💥 You've added 15 lbs to your bench this month. Tonight's push day - I'm sensing a new PR opportunity. Your body's ready. Let's test those limits!"

---

## Notification Analytics Dashboard

Track notification performance:

```sql
-- Most engaged times
SELECT
  substring(body, 1, 50) as message_preview,
  channel,
  COUNT(*) as sent,
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened,
  ROUND(100.0 * COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) / COUNT(*), 2) as open_rate
FROM notification_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY substring(body, 1, 50), channel
ORDER BY open_rate DESC;
```

---

## Troubleshooting

### Web Push Not Working

**Issue: "Registration failed"**
- Check VAPID keys are correct
- Verify service worker is registered (`/sw.js` exists)
- Check browser console for errors

**Issue: "Permission denied"**
- User blocked notifications
- Prompt them to re-enable in browser settings

**Issue: Notifications not appearing on iPhone**
- iOS Safari requires app to be "Add to Home Screen" first
- Regular Safari doesn't support push notifications
- Consider PWA approach for iOS

### Email Not Sending

**Issue: "Invalid API key"**
- Verify `RESEND_API_KEY` is correct
- Check key hasn't been revoked in Resend dashboard

**Issue: "Domain not verified"**
- Use `onboarding@resend.dev` for testing
- Verify custom domain DNS records

### Cron Not Running

**Issue: Cron not triggering**
- Check `vercel.json` is in root directory
- Verify `CRON_SECRET` is set in Vercel env vars
- Check Vercel deployment logs

**Issue: "Unauthorized" error**
- `CRON_SECRET` doesn't match
- Update in both `.env.local` and Vercel dashboard

---

## Production Checklist

Before going live:

- [ ] VAPID keys generated and added to `.env`
- [ ] Resend API key configured
- [ ] Domain verified in Resend
- [ ] Vercel Cron configured
- [ ] `CRON_SECRET` set in production
- [ ] Test notification sent successfully
- [ ] Service worker registered
- [ ] Notification permission prompt working
- [ ] User preferences UI complete
- [ ] Analytics tracking implemented
- [ ] Email templates look good on mobile
- [ ] Unsubscribe links working

---

## Costs Summary

**Per Active User (Elite tier, all channels enabled):**

| Channel | Cost/Month | Notes |
|---------|-----------|-------|
| Web Push | $0.00 | Free |
| Email | $0.03 | ~30 emails (Resend: $0.001/email) |
| SMS | $0.24 | ~30 SMS (Twilio: $0.0079/SMS) |
| OpenAI (AI generation) | $1.50 | GPT-4 for personalization |
| **Total Cost** | **$1.77/month** | Per active user |

**Revenue:**
- Elite tier: $29.99/month
- Costs: $1.77/month
- **Profit: $28.22/month (94% margin)** 🎉

---

## Future Enhancements

**Smart Timing:**
- A/B test notification times per user
- Learn when each user is most likely to engage
- Auto-adjust preferred time based on open rates

**Advanced Personalization:**
- Weather-based messages ("It's sunny - perfect for outdoor workout!")
- Recent life events ("Back from vacation - let's ease in")
- Social proof ("1,247 people crushed their workout today")

**Rich Notifications:**
- Images (progress charts, workout GIFs)
- Action buttons ("Start Workout", "View Progress")
- Inline workout preview

**Two-Way Interaction:**
- Reply to notification to log quick workout
- "Did you work out today?" → Yes/No buttons
- Voice note responses for feedback

---

**Questions?** Check:
- Web Push API: https://web.dev/push-notifications/
- Resend Docs: https://resend.com/docs
- Twilio Docs: https://www.twilio.com/docs/sms
- Vercel Cron: https://vercel.com/docs/cron-jobs
