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
    // Get user's subscription with all service subscriptions
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: {
        serviceSubscriptions: true,
      },
    });

    // Check if user has health coaching profile (means they've completed onboarding)
    const healthProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    // Build services list
    const services = [
      {
        id: 'health_coaching',
        name: 'Health & Fitness Coaching',
        description: 'AI-powered fitness coaching with portfolio analytics, predictions, and A/B testing',
        icon: '💪',
        gradient: 'from-green-500 to-emerald-400',
        status: healthProfile ? 'subscribed' : 'not_subscribed',
        plan: subscription?.serviceSubscriptions?.find(s => s.serviceId === 'health_coaching')?.plan || 'Free Trial',
        href: '/services/health-coaching',
        onboardingHref: healthProfile ? '/app/health/dashboard' : '/app/onboarding',
      },
      {
        id: 'custom_software',
        name: 'Custom Software Development',
        description: 'Bespoke software solutions tailored to your business needs',
        icon: '💻',
        gradient: 'from-blue-500 to-cyan-400',
        status: 'not_subscribed',
        href: '/services',
      },
      {
        id: 'ai_solutions',
        name: 'AI & Machine Learning',
        description: 'Custom AI models and MLOps pipelines for your business',
        icon: '🤖',
        gradient: 'from-purple-500 to-pink-500',
        status: 'not_subscribed',
        href: '/services',
      },
      {
        id: 'automation',
        name: 'Workflow Automation',
        description: 'Streamline operations and automate repetitive processes',
        icon: '⚡',
        gradient: 'from-amber-400 to-orange-500',
        status: 'not_subscribed',
        href: '/services',
      },
    ];

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('Failed to load services:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load services' },
      { status: 500 }
    );
  }
}
