import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: {
        serviceSubscriptions: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: {
          stripeCustomerId: null,
          serviceSubscriptions: [],
        },
      });
    }

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error('Failed to load billing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load billing data' },
      { status: 500 }
    );
  }
}
