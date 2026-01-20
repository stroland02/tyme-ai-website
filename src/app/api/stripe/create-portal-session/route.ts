import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBillingPortalSession, stripe } from '@/lib/stripe';

export async function POST() {
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

    // Ensure user has a valid Stripe customer ID
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Check if customer ID is invalid (missing, starts with "temp_", or other invalid format)
    const isInvalidCustomerId = !stripeCustomerId ||
                                 stripeCustomerId.startsWith('temp_') ||
                                 !stripeCustomerId.startsWith('cus_');

    if (isInvalidCustomerId) {
      // Create real Stripe customer
      const { createStripeCustomer } = await import('@/lib/stripe');
      const customer = await createStripeCustomer(
        user.email,
        user.name || undefined
      );
      stripeCustomerId = customer.id;

      // Update or create subscription with real customer ID
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

    // Get and clean the return URL
    const rawReturnUrl = process.env.NEXTAUTH_URL ||
                         process.env.NEXT_PUBLIC_SITE_URL ||
                         'https://tyme-ai.com';

    const cleanReturnUrl = rawReturnUrl
      .replace(/["'\s\n\r\t\\]+/g, '')
      .replace(/\/$/, '') + '/account/billing';

    console.log('Portal return URL cleaned:', { raw: rawReturnUrl, clean: cleanReturnUrl });

    // Ensure we have a valid customer ID
    if (!stripeCustomerId) {
      throw new Error('Failed to get or create Stripe customer ID');
    }

    // Create Stripe Billing Portal Session
    const portalSession = await createBillingPortalSession(
      stripeCustomerId,
      cleanReturnUrl
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
