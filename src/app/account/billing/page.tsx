'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

interface ServiceSubscription {
  id: string;
  serviceId: string;
  serviceName: string;
  plan: string;
  status: string;
  stripeCurrentPeriodEnd?: string;
}

interface SubscriptionData {
  stripeCustomerId: string;
  serviceSubscriptions: ServiceSubscription[];
}

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadBillingData();
    }
  }, [status, router]);

  const loadBillingData = async () => {
    try {
      const response = await fetch('/api/user/billing');
      if (!response.ok) throw new Error('Failed to load billing data');

      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Failed to load billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || 'Failed to open billing portal');
      setActionLoading(false);
    }
  };

  const handleSubscribeToService = async (serviceId: string, plan: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || 'Failed to start checkout');
      setActionLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted font-mono">Loading billing...</p>
        </div>
      </main>
    );
  }

  const activeSubscriptions = subscription?.serviceSubscriptions?.filter(s => s.status === 'active') || [];
  const hasStripeConfigured = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <CodeLabel index="01">billing.dashboard()</CodeLabel>
            <h1 className="text-4xl font-bold">Billing & Subscriptions</h1>
            <p className="text-foreground-muted font-mono text-sm">
              // Manage your subscriptions and payment methods
            </p>
          </div>

          {!hasStripeConfigured && (
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-amber-600 mb-2">Stripe Not Configured</h3>
                  <p className="text-sm text-foreground-muted mb-4">
                    Payment processing is not yet set up. This is a development environment.
                  </p>
                  <p className="text-xs text-foreground-subtle font-mono">
                    To enable payments, configure STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Subscriptions */}
          {activeSubscriptions.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Active Subscriptions</h2>
                {hasStripeConfigured && (
                  <button
                    onClick={handleManageSubscription}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm bg-background border border-border hover:border-primary/50 rounded-lg font-mono transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Loading...' : 'Manage in Stripe →'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {activeSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-6 bg-background/50 border border-border rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold">{sub.serviceName}</h3>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-mono rounded">
                            {sub.plan}
                          </span>
                          <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-mono rounded">
                            {sub.status}
                          </span>
                        </div>
                        {sub.stripeCurrentPeriodEnd && (
                          <p className="text-sm text-foreground-muted font-mono">
                            Renews on: {new Date(sub.stripeCurrentPeriodEnd).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link
                        href={
                          sub.serviceId === 'health_coaching'
                            ? '/app/health/dashboard'
                            : '/account'
                        }
                        className="text-sm text-primary hover:underline font-mono"
                      >
                        View service →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Available Plans</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Trial */}
              <div className="p-6 bg-background/50 border border-border rounded-xl">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Free Trial</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-foreground-muted text-sm">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Basic AI coaching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Manual workout logging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Basic meal tracking</span>
                    </li>
                  </ul>

                  <button
                    disabled
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm opacity-50 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="p-6 bg-background/50 border border-primary rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-white text-xs font-mono">
                  Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Pro</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold">$14.99</span>
                      <span className="text-foreground-muted text-sm">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>AI workout generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>AI meal plans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Progress analytics</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribeToService('health_coaching', 'pro')}
                    disabled={actionLoading || !hasStripeConfigured}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-mono text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Loading...' : 'Upgrade to Pro'}
                  </button>
                </div>
              </div>

              {/* Elite Plan */}
              <div className="p-6 bg-background/50 border border-border rounded-xl">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Elite</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold">$29.99</span>
                      <span className="text-foreground-muted text-sm">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>A/B testing experiments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribeToService('health_coaching', 'elite')}
                    disabled={actionLoading || !hasStripeConfigured}
                    className="w-full px-4 py-2 bg-background border border-border hover:border-primary/50 rounded-lg font-mono text-sm transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Loading...' : 'Upgrade to Elite'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {hasStripeConfigured && (
            <div className="bg-background/50 border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-4">
                <p className="text-sm text-foreground-muted">
                  Manage your payment methods through the Stripe Customer Portal
                </p>
                <button
                  onClick={handleManageSubscription}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Loading...' : 'managePaymentMethods()'}
                </button>
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center pt-8 border-t border-border">
            <Link
              href="/account"
              className="text-foreground-subtle hover:text-foreground font-mono text-sm transition-colors"
            >
              ← Back to account
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
