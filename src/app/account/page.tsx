'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { CodeCTA } from '@/components/ui/CodeCTA';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  status: 'not_subscribed' | 'subscribed' | 'trial';
  plan?: string;
  href: string;
  onboardingHref?: string;
}

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadServices();
    }
  }, [status, router]);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/user/services');
      const data = await response.json();
      setServices(data.services || getDefaultServices());
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultServices = (): Service[] => [
    {
      id: 'health_coaching',
      name: 'Health & Fitness Coaching',
      description: 'AI-powered fitness coaching with portfolio analytics, predictions, and A/B testing',
      icon: '💪',
      gradient: 'from-green-500 to-emerald-400',
      status: 'not_subscribed',
      href: '/services/health-coaching',
      onboardingHref: '/app/onboarding',
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

  if (loading || status === 'loading') {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted font-mono">Loading your account...</p>
        </div>
      </main>
    );
  }

  const subscribedServices = services.filter(s => s.status !== 'not_subscribed');
  const availableServices = services.filter(s => s.status === 'not_subscribed');

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <CodeLabel index="01">account.dashboard()</CodeLabel>
            <h1 className="text-4xl font-bold">
              Welcome back, {session?.user?.name || 'User'}! 👋
            </h1>
            <p className="text-foreground-muted font-mono text-sm">
              // Manage all your Tyme AI services and subscriptions
            </p>
          </div>

          {/* My Services */}
          {subscribedServices.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Services</h2>
                <Link
                  href="/account/billing"
                  className="text-sm text-primary hover:underline font-mono"
                >
                  Manage billing →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {subscribedServices.map((service) => (
                  <Link
                    key={service.id}
                    href={service.onboardingHref || service.href}
                    className="group relative overflow-hidden rounded-xl border border-border bg-background/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${service.gradient}`} />

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{service.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold">{service.name}</h3>
                            <p className="text-xs font-mono text-foreground-subtle">
                              {service.plan || 'Active'}
                            </p>
                          </div>
                        </div>
                        {service.status === 'trial' && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono rounded">
                            Trial
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-foreground-muted">{service.description}</p>

                      <div className="flex items-center text-sm font-mono text-primary group-hover:gap-2 transition-all">
                        <span>Open →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Available Services */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Services</h2>
              <p className="text-foreground-muted text-sm">
                Explore and subscribe to additional Tyme AI services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {availableServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background/50 p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{service.icon}</span>
                      <h3 className="text-lg font-bold">{service.name}</h3>
                    </div>

                    <p className="text-sm text-foreground-muted">{service.description}</p>

                    <CodeCTA
                      functionName="learnMore"
                      href={service.href}
                      variant="primary"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-border">
            <Link
              href="/account/billing"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="text-2xl mb-2">💳</div>
              <h3 className="font-bold mb-1">Billing & Payments</h3>
              <p className="text-sm text-foreground-muted">Manage subscriptions and invoices</p>
            </Link>

            <Link
              href="/account/settings"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-bold mb-1">Account Settings</h3>
              <p className="text-sm text-foreground-muted">Update your profile and preferences</p>
            </Link>

            <Link
              href="/contact"
              className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-bold mb-1">Get Help</h3>
              <p className="text-sm text-foreground-muted">Contact support for assistance</p>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
