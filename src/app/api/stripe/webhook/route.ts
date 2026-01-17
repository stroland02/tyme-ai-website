import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  console.log('Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        // You can add logic here to send receipts, update payment history, etc.
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error('Payment failed for invoice:', invoice.id);
        // You can add logic here to notify users about failed payments
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  console.log('Checkout completed for user:', userId);

  // The subscription will be created/updated via the subscription.created event
  // Here we just log the successful checkout
}

async function handleSubscriptionUpdate(stripeSubscription: Stripe.Subscription) {
  const userId = stripeSubscription.metadata.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Get the subscription from our database
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: { serviceSubscriptions: true },
  });

  if (!subscription) {
    console.error('Subscription not found for user:', userId);
    return;
  }

  // Determine the plan based on the price
  const priceId = stripeSubscription.items.data[0]?.price.id;
  let plan = 'free';
  let serviceId = 'health_coaching'; // Default to health coaching for now

  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) {
    plan = 'pro';
  } else if (priceId === process.env.STRIPE_PRICE_ELITE_MONTHLY) {
    plan = 'elite';
  }

  // Check if service subscription already exists
  const existingServiceSub = subscription.serviceSubscriptions.find(
    (s) => s.serviceId === serviceId
  );

  if (existingServiceSub) {
    // Update existing service subscription
    await prisma.serviceSubscription.update({
      where: { id: existingServiceSub.id },
      data: {
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId || undefined,
        plan,
        status: stripeSubscription.status,
        stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
  } else {
    // Create new service subscription
    await prisma.serviceSubscription.create({
      data: {
        subscriptionId: subscription.id,
        serviceId,
        serviceName: 'Health & Fitness Coaching',
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId || undefined,
        plan,
        status: stripeSubscription.status,
        stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
  }

  console.log(`Subscription updated for user ${userId}: ${plan}`);
}

async function handleSubscriptionCanceled(stripeSubscription: Stripe.Subscription) {
  const userId = stripeSubscription.metadata.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Find and update the service subscription
  const serviceSubscription = await prisma.serviceSubscription.findFirst({
    where: {
      stripeSubscriptionId: stripeSubscription.id,
    },
  });

  if (serviceSubscription) {
    await prisma.serviceSubscription.update({
      where: { id: serviceSubscription.id },
      data: {
        status: 'canceled',
        plan: 'free',
      },
    });

    console.log(`Subscription canceled for user ${userId}`);
  }
}
