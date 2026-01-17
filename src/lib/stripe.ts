import Stripe from 'stripe';

// Validate and sanitize the Stripe secret key
function getValidatedSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    console.log('Stripe secret key not found in environment');
    return null;
  }

  // Remove all whitespace (spaces, tabs, newlines, carriage returns)
  const sanitized = key.replace(/\s/g, '');

  // Basic validation: must start with sk_
  if (!sanitized.startsWith('sk_')) {
    console.error('Stripe secret key does not start with sk_');
    return null;
  }

  // Validate minimum length (Stripe keys are ~100+ chars)
  if (sanitized.length < 50) {
    console.error('Stripe secret key is too short');
    return null;
  }

  // Validate format: sk_live_ or sk_test_ followed by alphanumeric characters
  if (!/^sk_(live|test)_[A-Za-z0-9]+$/.test(sanitized)) {
    console.error('Invalid Stripe secret key format');
    return null;
  }

  return sanitized;
}

// Lazy-loaded Stripe client to avoid module-level initialization issues
let stripeInstance: Stripe | null = null;

function getStripeClient(): Stripe | null {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = getValidatedSecretKey();

  if (!secretKey) {
    return null;
  }

  try {
    // Initialize Stripe without explicit API version to use SDK default
    // This avoids version mismatch errors between TypeScript types and Stripe API
    stripeInstance = new Stripe(secretKey);

    return stripeInstance;
  } catch (error) {
    console.error('Failed to initialize Stripe client:', error);
    return null;
  }
}

// Export getter instead of direct instance
export const stripe = getStripeClient();

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
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured');
  }
  return await client.customers.create({
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
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured');
  }
  return await client.checkout.sessions.create({
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
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured');
  }
  return await client.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Helper to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured');
  }
  return await client.subscriptions.cancel(subscriptionId);
}

// Helper to update subscription (upgrade/downgrade)
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured');
  }
  const subscription = await client.subscriptions.retrieve(subscriptionId);
  return await client.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice', // Charge difference immediately
  });
}
