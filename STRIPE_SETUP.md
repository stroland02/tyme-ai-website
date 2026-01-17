# Stripe Payment Setup Guide

This guide explains how to set up Stripe for the Tyme AI website payment processing.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Access to your Stripe Dashboard
- Development environment running

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Create Products and Prices

### Create Pro Plan

1. Go to https://dashboard.stripe.com/products
2. Click **Add Product**
3. Fill in details:
   - **Name**: Health Coaching - Pro
   - **Description**: AI-powered health coaching with workout generation and meal plans
   - **Pricing**: Recurring, Monthly, $14.99 USD
4. Click **Save product**
5. **Copy the Price ID** (starts with `price_`) - you'll need this

### Create Elite Plan

1. Click **Add Product** again
2. Fill in details:
   - **Name**: Health Coaching - Elite
   - **Description**: Premium health coaching with A/B testing, experiments, and API access
   - **Pricing**: Recurring, Monthly, $29.99 USD
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_`) - you'll need this

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs (from products created above)
STRIPE_PRICE_PRO_MONTHLY=price_your_pro_price_id_here
STRIPE_PRICE_ELITE_MONTHLY=price_your_elite_price_id_here

# Stripe Webhook Secret (we'll get this in Step 4)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 4: Set Up Webhook (for Production)

Webhooks allow Stripe to notify your application when payment events occur.

### For Local Development (Using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run in terminal:
   ```bash
   stripe login
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Production

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Set **Endpoint URL**: `https://tyme-ai.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing secret** and add to your production environment variables

## Step 5: Configure Customer Portal

The Customer Portal allows users to manage their subscriptions.

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Click **Activate test link** (or **Activate** for production)
3. Configure settings:
   - **Business Information**: Add your business name and support email
   - **Functionality**:
     - ✅ Allow customers to update their payment methods
     - ✅ Allow customers to update subscriptions
     - ✅ Allow customers to cancel subscriptions
   - **Product and pricing**: Make sure your Pro and Elite plans are enabled
4. Click **Save changes**

## Step 6: Test the Integration

### Test with Stripe Test Cards

Use these test card numbers (any future expiry date, any CVC):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Testing Flow

1. Go to http://localhost:3000/auth/signup
2. Create a test account
3. Navigate to `/account/billing`
4. Click "Upgrade to Pro" or "Upgrade to Elite"
5. Use test card `4242 4242 4242 4242`
6. Complete checkout
7. Verify subscription shows as "active" in your account

### Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/customers
2. Find your test customer
3. Click on their name
4. Verify the subscription is active

## Step 7: Deploy to Production

### Update Environment Variables on Vercel

```bash
# Get production keys from Stripe Dashboard
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_PRICE_PRO_MONTHLY production
vercel env add STRIPE_PRICE_ELITE_MONTHLY production
vercel env add STRIPE_WEBHOOK_SECRET production

# Redeploy
vercel --prod
```

### Switch to Live Mode

1. Toggle **View test data** to **OFF** in Stripe Dashboard
2. Create new products with live prices
3. Update webhook to use production URL
4. Update environment variables with live keys

## Troubleshooting

### "Stripe is not configured" error

- Verify `STRIPE_SECRET_KEY` is set in `.env.local`
- Restart dev server after adding environment variables

### Webhook not receiving events

- Check webhook signing secret is correct
- For local dev, ensure Stripe CLI is running
- Check webhook endpoint returns 200 status
- View webhook logs in Stripe Dashboard

### Checkout session not creating

- Verify price IDs are correct
- Check that products are active in Stripe Dashboard
- Ensure customer has valid Stripe customer ID

### Subscription not showing in app

- Check webhook is receiving events
- Verify webhook handler is updating database correctly
- Check database has `ServiceSubscription` record

## Current Implementation Status

✅ **Completed:**
- Stripe SDK integration
- Product plans (Free, Pro, Elite)
- Checkout session creation
- Customer portal integration
- Webhook handler for subscription events
- Billing page with subscription management
- Account settings page

⏳ **To Configure:**
- Stripe API keys (Step 1)
- Products and prices (Step 2)
- Environment variables (Step 3)
- Webhook endpoint (Step 4)
- Customer portal (Step 5)

## Security Notes

- **Never commit** API keys to git
- Use test mode for development
- Verify webhook signatures
- Use HTTPS in production
- Rotate keys if compromised

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Cards: https://stripe.com/docs/testing

## Pricing Summary

| Plan | Price | Features |
|------|-------|----------|
| **Free Trial** | $0/mo | Basic AI coaching, manual logging |
| **Pro** | $14.99/mo | AI workout/meal generation, analytics |
| **Elite** | $29.99/mo | A/B testing, API access, priority support |

All paid plans include a **14-day free trial** (configured in `createCheckoutSession`).
