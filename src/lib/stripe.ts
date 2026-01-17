import Stripe from 'stripe';

// Allow development without Stripe configured
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY.trim(), {
      typescript: true,
    })
  : null;

// Price IDs for subscription plans (you'll get these from Stripe Dashboard)
export const STRIPE_PLANS = {
  FREE_TRIAL: {
    name: 'Free Trial',
    price: 0,
    priceId: null, // No Stripe price for free trial
  },
  PRO_MONTHLY: {
    name: 'Pro Monthly',
    price: 1499, // $14.99 in cents
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '', // Set in .env
  },
  ELITE_MONTHLY: {
    name: 'Elite Monthly',
    price: 2999, // $29.99 in cents
    priceId: process.env.STRIPE_PRICE_ELITE_MONTHLY || '', // Set in .env
  },
};

// Helper to create a customer
export async function createStripeCustomer(email: string, name?: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      source: 'health_coaching_app',
    },
  });
}

// Helper to create a checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
      trial_period_days: 14, // 14-day free trial
    },
  });
}

// Helper to create a billing portal session (for managing subscription)
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Helper to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return await stripe.subscriptions.cancel(subscriptionId);
}

// Helper to update subscription (upgrade/downgrade)
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice', // Charge difference immediately
  });
}
