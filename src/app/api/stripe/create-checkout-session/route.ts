import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, STRIPE_PLANS, stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
      { status: 503 }
    );
  }

  try {
    const { serviceId, plan } = await request.json();

    if (!serviceId || !plan) {
      return NextResponse.json(
        { error: 'Service ID and plan are required' },
        { status: 400 }
      );
    }

    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Ensure user has a Stripe customer ID
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create Stripe customer if it doesn't exist
      const { createStripeCustomer } = await import('@/lib/stripe');
      const customer = await createStripeCustomer(
        user.email,
        user.name || undefined
      );
      stripeCustomerId = customer.id;

      // Update or create subscription with customer ID
      if (user.subscription) {
        await prisma.subscription.update({
          where: { id: user.subscription.id },
          data: { stripeCustomerId },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeCustomerId,
          },
        });
      }
    }

    // Get the appropriate price ID based on plan
    let priceId: string;
    if (plan === 'pro') {
      priceId = STRIPE_PLANS.PRO_MONTHLY.priceId;
    } else if (plan === 'elite') {
      priceId = STRIPE_PLANS.ELITE_MONTHLY.priceId;
    } else {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan. Please set STRIPE_PRICE_PRO_MONTHLY or STRIPE_PRICE_ELITE_MONTHLY in environment variables.' },
        { status: 503 }
      );
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXTAUTH_URL ||
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    'https://tyme-ai.com';

    // Ensure base URL doesn't have trailing slash
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Create Stripe Checkout Session
    const checkoutSession = await createCheckoutSession(
      stripeCustomerId,
      priceId,
      session.user.id,
      `${cleanBaseUrl}/account/billing?success=true`,
      `${cleanBaseUrl}/account/billing?canceled=true`
    );

    // Validate checkout session URL
    if (!checkoutSession.url) {
      throw new Error('Stripe checkout session created but URL is missing');
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
