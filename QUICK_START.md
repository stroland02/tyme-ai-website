# ⚡ Quick Start - Test Locally (5 Minutes)

## Get the App Running Without Full Setup

You can test the authentication and onboarding flow **without** setting up Stripe, OpenAI, or notifications!

---

## Step 1: Install Dependencies ✓ (Already Done!)

```bash
cd tyme-ai-website
npm install
```

---

## Step 2: Set Up Database (Required)

### Option A: Local SQLite (Fastest - 2 minutes)

**Use SQLite for local development:**

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Create database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **View database:**
   ```bash
   npx prisma studio
   ```

### Option B: Vercel Postgres (Production-Ready)

See `SETUP_HEALTH_APP.md` for full setup.

---

## Step 3: Create `.env.local` File

Create `tyme-ai-website/.env.local`:

```bash
# Minimal setup for testing
DATABASE_URL="file:./dev.db"

# Authentication (required)
NEXTAUTH_SECRET="your-secret-here-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Optional (can skip for testing)
# STRIPE_SECRET_KEY="sk_test_..."
# OPENAI_API_KEY="sk-..."
```

**Generate secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 4: Start Dev Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Step 5: Test the Flow

1. **Visit**: http://localhost:3000/services/health-coaching
2. **Click**: "Start Free Trial"
3. **Sign Up**:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. **Complete Onboarding**: Fill in all 5 steps
5. **Success!**: You'll be redirected to `/app/dashboard`

---

## Troubleshooting

### Error: "Database not found"

**Fix:**
```bash
npx prisma generate
npx prisma db push
```

### Error: "NEXTAUTH_SECRET not found"

**Fix:** Add to `.env.local`:
```bash
NEXTAUTH_SECRET="any-random-32-character-string-here-ok"
```

### Error: "Stripe is not configured"

**This is OK!** The app works without Stripe for testing. You'll create a temporary customer ID.

### Error: "Module not found"

**Fix:**
```bash
npm install
```

### Port 3000 in use

**Fix:**
```bash
# Kill existing process
taskkill /F /IM node.exe

# Or use different port
npm run dev -- -p 3001
```

---

## What Works Without Full Setup

✅ **Sign up / Sign in** - Create accounts and log in
✅ **Onboarding** - Complete the 5-step wizard
✅ **Database** - Save user profiles, goals, measurements
✅ **Sessions** - Stay logged in with JWT

❌ **Stripe payments** - Need API keys (optional for testing)
❌ **AI features** - Need OpenAI key (coming next)
❌ **Notifications** - Need VAPID keys (optional)
❌ **Dashboard** - Not built yet (next step!)

---

## View Your Data

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

Then navigate to:
- **users** - See created accounts
- **profiles** - See onboarding data
- **goals** - See user goals
- **measurements** - See initial weights

---

## Next Steps

### To Build Dashboard:
Continue development to create the main app interface.

### To Deploy:
1. Set up Vercel Postgres (production database)
2. Add all environment variables in Vercel
3. Deploy via GitHub integration

---

## Environment Variables Reference

### Required (Minimal Setup)
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional (Full Features)
```bash
# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# OpenAI (for AI features)
OPENAI_API_KEY="sk-..."

# Notifications (for daily motivation)
VAPID_PUBLIC_KEY="BFD..."
VAPID_PRIVATE_KEY="xyz..."
RESEND_API_KEY="re_..."
CRON_SECRET="random-secret"
```

---

## File Structure (What You Built)

```
tyme-ai-website/
├── prisma/
│   ├── schema.prisma          # Database schema (17 tables)
│   └── dev.db                 # SQLite database (local only)
│
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── health-coaching/
│   │   │       └── page.tsx   # Landing page ✓
│   │   │
│   │   ├── auth/
│   │   │   ├── signin/        # Sign in page ✓
│   │   │   └── signup/        # Sign up page ✓
│   │   │
│   │   ├── app/
│   │   │   ├── onboarding/    # 5-step wizard ✓
│   │   │   └── dashboard/     # TODO: Build next
│   │   │
│   │   └── api/
│   │       ├── auth/          # Authentication ✓
│   │       └── user/          # User data ✓
│   │
│   └── lib/
│       ├── prisma.ts          # Database client ✓
│       ├── stripe.ts          # Payments ✓
│       ├── auth.ts            # NextAuth ✓
│       └── notifications.ts   # AI notifications ✓
│
├── .env.local                 # Your environment variables
├── package.json
└── README.md
```

---

## 🎉 You're Ready!

Your health coaching app is now running locally. You can:

- ✅ Create accounts
- ✅ Sign in/out
- ✅ Complete onboarding
- ✅ See data in Prisma Studio

**Next:** Build the dashboard to see today's workouts and meals! 🚀
