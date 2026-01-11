# Health Coaching App - Setup Guide

## 🎯 Overview

This guide covers setting up the complete health coaching platform with:
- **Database** (Vercel Postgres)
- **Stripe Payments** with bank account payouts
- **Authentication** (NextAuth.js)
- **OpenAI Integration** for AI coaching

---

## 📊 Step 1: Database Setup (Vercel Postgres)

### Option A: Vercel Postgres (Recommended - Free tier available)

1. **Create Database in Vercel Dashboard**
   ```bash
   # Go to: https://vercel.com/dashboard
   # Navigate to: Storage → Create Database → Postgres
   # Choose: Hobby (Free) or Pro
   ```

2. **Get Connection String**
   - After creating, copy the `DATABASE_URL` from the `.env.local` tab
   - It looks like: `postgres://user:password@host:5432/database`

3. **Add to Local `.env.local` file**
   ```bash
   # Create or edit tyme-ai-website/.env.local
   DATABASE_URL="your_postgres_url_here"
   ```

4. **Run Prisma Migrations**
   ```bash
   cd tyme-ai-website
   npx prisma generate
   npx prisma db push
   ```

   This creates all 14 tables:
   - `users`, `accounts`, `sessions` (auth)
   - `profiles`, `goals` (user data)
   - `workouts`, `exercises` (fitness tracking)
   - `meals` (nutrition)
   - `measurements` (progress tracking)
   - `achievements` (gamification)
   - `experiments` (A/B testing)
   - `subscriptions` (Stripe billing)
   - `api_keys` (Elite tier API access)

### Verify Database

```bash
npx prisma studio
# Opens database GUI at http://localhost:5555
```

---

## 💳 Step 2: Stripe Setup (with Bank Account Payouts)

### Create Stripe Account

1. **Sign up at https://stripe.com**
   - Choose "Start now" (free account)
   - Complete business verification (required for payouts)

### Set Up Products & Pricing

2. **Create Products in Stripe Dashboard**

   Go to: `Products` → `Add Product`

   **Product 1: Pro Monthly**
   - Name: `Health Coaching - Pro Monthly`
   - Price: `$14.99 USD`
   - Billing: `Recurring` → `Monthly`
   - Copy the **Price ID** (starts with `price_...`)

   **Product 2: Elite Monthly**
   - Name: `Health Coaching - Elite Monthly`
   - Price: `$29.99 USD`
   - Billing: `Recurring` → `Monthly`
   - Copy the **Price ID**

### Configure Bank Account for Payouts

3. **Add Bank Account**

   Go to: `Settings` → `Business Settings` → `Bank accounts and scheduling`

   - Click `Add bank account`
   - Enter your routing number and account number
   - Stripe will make 2 small deposits to verify (2-3 days)
   - Verify the amounts to activate payouts

4. **Set Payout Schedule**

   - **Daily**: Get paid every day (default, recommended)
   - **Weekly**: Get paid every Friday
   - **Monthly**: Get paid on the 1st of each month
   - **Manual**: You trigger payouts manually

   **Recommended**: Daily payouts with 2-day rolling basis

### Get API Keys

5. **Get Your API Keys**

   Go to: `Developers` → `API keys`

   - **Publishable key**: `pk_test_...` (for frontend)
   - **Secret key**: `sk_test_...` (for backend)

   ⚠️ **IMPORTANT**: These are TEST keys. When you're ready to go live:
   - Toggle "Test mode" OFF in the Stripe Dashboard
   - Get your LIVE keys (`pk_live_...` and `sk_live_...`)

### Add Keys to Environment Variables

6. **Update `.env.local`**

   ```bash
   # Stripe Keys
   STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"

   # Stripe Price IDs (from step 2)
   STRIPE_PRICE_PRO_MONTHLY="price_xxx_for_pro"
   STRIPE_PRICE_ELITE_MONTHLY="price_xxx_for_elite"

   # Stripe Webhook Secret (we'll add this later)
   STRIPE_WEBHOOK_SECRET=""
   ```

### Enable Customer Portal (for subscription management)

7. **Configure Billing Portal**

   Go to: `Settings` → `Billing` → `Customer portal`

   Enable:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to view invoices
   - ✅ Allow customers to update billing information

### Set Up Webhooks (for subscription events)

8. **Create Webhook Endpoint**

   After deploying to Vercel:
   - Go to: `Developers` → `Webhooks` → `Add endpoint`
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

   - Copy the **Signing secret** (starts with `whsec_...`)
   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET="whsec_..."`

### Understanding Stripe Fees & Payouts

**Transaction Fees:**
- 2.9% + $0.30 per successful card charge
- Example: $14.99 subscription → You receive $14.25 after fees

**Payout Timeline:**
- Payments are held for 2 days (rolling basis)
- Then automatically transferred to your bank account
- Bank transfer takes 1-2 business days

**Example Timeline:**
- Monday: Customer pays $14.99
- Wednesday: Funds available for payout
- Thursday: Funds deposited in your bank account

---

## 🔐 Step 3: Authentication Setup (NextAuth.js)

### Generate Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

### Add to `.env.local`

```bash
NEXTAUTH_SECRET="your_generated_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

When deployed to production:
```bash
NEXTAUTH_URL="https://your-domain.com"
```

---

## 🤖 Step 4: OpenAI Integration (for AI Coaching)

### Get API Key

1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)

### Add to `.env.local`

```bash
OPENAI_API_KEY="sk-your_openai_key_here"
```

### Estimated Costs

**AI Workout Generation:**
- Uses GPT-4 Turbo
- ~500-1000 tokens per workout
- Cost: ~$0.01-0.03 per workout

**AI Meal Plan:**
- ~300-600 tokens per meal plan
- Cost: ~$0.01-0.02 per plan

**Expected Monthly Cost per User:**
- Active user: 30 workouts + 30 meal plans
- **~$1.50/month per active user**
- You charge $14.99/month
- **Profit margin: ~90%** (after OpenAI costs)

---

## 📝 Complete `.env.local` Example

```bash
# Database
DATABASE_URL="postgres://user:pass@host:5432/db"

# Authentication
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_ELITE_MONTHLY="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Optional: Email (for notifications)
RESEND_API_KEY="re_..."
```

---

## 🚀 Step 5: Deploy to Production

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add health coaching app"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to: https://vercel.com/new
   - Import your GitHub repo
   - Add all environment variables (from `.env.local`)
   - Click `Deploy`

3. **Update URLs**
   - Set `NEXTAUTH_URL` to your production domain
   - Update Stripe webhook URL

### Post-Deployment

4. **Test Payment Flow**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future date, any CVC, any ZIP
   - Complete a test subscription

5. **Switch to Live Mode**
   - When ready for real customers
   - Toggle Stripe to "Live mode"
   - Update API keys to live keys (`sk_live_...`, `pk_live_...`)
   - Recreate products with live prices

---

## 💰 Stripe Bank Account Payout Summary

### How to Get Paid

1. **Automatic Payouts** (Recommended)
   - Set schedule: Daily, Weekly, or Monthly
   - Stripe automatically transfers funds to your bank
   - No action required from you

2. **Manual Payouts**
   - Go to: `Balance` → `Payouts` → `Pay out funds`
   - Specify amount
   - Confirm transfer

### View Your Balance

- Dashboard: `Balance` tab
  - **Available**: Ready to payout now
  - **Pending**: Waiting for 2-day hold period

### Track Earnings

- `Payments` → Filter by date range
- `Reports` → Financial reports
- Export to CSV for accounting

### Tax Information

- Stripe will send you a 1099-K if you process >$20,000 in payments
- Track revenue in `Reports` → `Tax reports`
- Consult with an accountant for tax filing

---

## ✅ Verification Checklist

Before launch, verify:

- [ ] Database connected and migrations run
- [ ] Stripe products created (Pro $14.99, Elite $29.99)
- [ ] Bank account connected to Stripe
- [ ] Test payment completed successfully
- [ ] Webhook receiving events
- [ ] OpenAI API key working
- [ ] NextAuth authentication working
- [ ] `.env.local` has all required keys
- [ ] Production environment variables set in Vercel
- [ ] Test subscription flow end-to-end

---

## 🆘 Troubleshooting

### Database Issues

**Error: P1001 Can't reach database server**
- Check `DATABASE_URL` is correct
- Verify database is running (Vercel Postgres dashboard)

**Error: Table doesn't exist**
```bash
npx prisma db push
```

### Stripe Issues

**Error: No such price**
- Verify `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_ELITE_MONTHLY` are set
- Check you copied the correct Price ID (not Product ID)

**Webhook not receiving events**
- Check webhook URL is correct
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook logs in Stripe Dashboard → `Developers` → `Webhooks`

### OpenAI Issues

**Error: Incorrect API key**
- Verify `OPENAI_API_KEY` starts with `sk-`
- Check you copied the entire key

**Rate limit exceeded**
- You're on free tier with low limits
- Upgrade to pay-as-you-go: https://platform.openai.com/account/billing

---

## 📚 Next Steps

Once setup is complete:

1. Build the dashboard UI
2. Create onboarding flow
3. Implement AI workout generation
4. Add progress tracking charts
5. Test on mobile (iPhone)
6. Launch! 🚀

---

## 💡 Tips for Success

**Start in Test Mode:**
- Build and test everything with Stripe test keys
- Use test credit cards
- Switch to live mode only when ready

**Monitor Your Metrics:**
- Track customer acquisition cost (CAC)
- Calculate lifetime value (LTV)
- Monitor churn rate
- Watch AI costs vs revenue

**Optimize AI Costs:**
- Cache common workout templates
- Use GPT-3.5 for simple tasks
- Batch API requests when possible

**Bank Account Tips:**
- Use a business checking account
- Enable two-factor authentication
- Monitor for fraud
- Keep records of all transactions

---

**Need help?** Check:
- Stripe Docs: https://stripe.com/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- OpenAI Docs: https://platform.openai.com/docs
