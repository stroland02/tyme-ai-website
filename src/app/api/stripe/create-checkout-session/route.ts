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

    // Get user's subscription
    const userSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!userSubscription) {
      return NextResponse.json(
        { error: 'User subscription not found' },
        { status: 404 }
      );
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

    // Create Stripe Checkout Session
    const checkoutSession = await createCheckoutSession(
      userSubscription.stripeCustomerId,
      priceId,
      session.user.id,
      `${process.env.NEXTAUTH_URL}/account/billing?success=true`,
      `${process.env.NEXTAUTH_URL}/account/billing?canceled=true`
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
