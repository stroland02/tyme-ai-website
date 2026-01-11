'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { CodeCTA } from '@/components/ui/CodeCTA';

interface DashboardStats {
  streak: number;
  totalWorkouts: number;
  weekWorkouts: number;
  todayCalories: number;
  weeklyGoalProgress: number;
  motivationalMessage: string;
  currentWeight?: number;
  goalWeight?: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'workout' | 'meal' | 'measurement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export default function HealthDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadDashboard();
    }
  }, [status, router]);

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/health/dashboard');
      if (!response.ok) {
        if (response.status === 404) {
          // User hasn't completed onboarding
          router.push('/app/onboarding');
          return;
        }
        throw new Error('Failed to load dashboard');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted font-mono">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-background">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Unable to load dashboard</h1>
            <p className="text-foreground-muted mb-6">There was an error loading your data.</p>
            <CodeCTA functionName="tryAgain" onClick={loadDashboard} variant="primary" />
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <CodeLabel index="01">health.dashboard()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">
                Welcome back, {session?.user?.name}! 💪
              </h1>
            </div>
            <Link
              href="/account"
              className="text-sm text-foreground-subtle hover:text-foreground font-mono"
            >
              ← Back to account
            </Link>
          </div>

          {/* Motivational Message */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-8 text-white shadow-lg">
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">🔥</div>
                <div className="text-right">
                  <div className="text-sm font-mono opacity-80">Daily Streak</div>
                  <div className="text-4xl font-bold">{stats.streak}</div>
                  <div className="text-xs font-mono opacity-80">days</div>
                </div>
              </div>
              <p className="text-lg leading-relaxed">{stats.motivationalMessage}</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background/50 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏋️</span>
                <div className="text-sm font-mono text-foreground-subtle">This Week</div>
              </div>
              <div className="text-3xl font-bold">{stats.weekWorkouts}</div>
              <div className="text-xs text-foreground-muted font-mono">workouts completed</div>
            </div>

            <div className="bg-background/50 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <div className="text-sm font-mono text-foreground-subtle">Total</div>
              </div>
              <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
              <div className="text-xs text-foreground-muted font-mono">lifetime workouts</div>
            </div>

            <div className="bg-background/50 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🍎</span>
                <div className="text-sm font-mono text-foreground-subtle">Today</div>
              </div>
              <div className="text-3xl font-bold">{stats.todayCalories}</div>
              <div className="text-xs text-foreground-muted font-mono">calories logged</div>
            </div>

            <div className="bg-background/50 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎯</span>
                <div className="text-sm font-mono text-foreground-subtle">Weekly Goal</div>
              </div>
              <div className="text-3xl font-bold">{stats.weeklyGoalProgress}%</div>
              <div className="text-xs text-foreground-muted font-mono">progress</div>
            </div>
          </div>

          {/* Progress Overview */}
          {stats.currentWeight && stats.goalWeight && (
            <div className="bg-background/50 border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Weight Progress</h2>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-foreground-subtle font-mono">Current</div>
                  <div className="text-2xl font-bold">{stats.currentWeight} lbs</div>
                </div>
                <div className="text-4xl">→</div>
                <div className="text-right">
                  <div className="text-sm text-foreground-subtle font-mono">Goal</div>
                  <div className="text-2xl font-bold">{stats.goalWeight} lbs</div>
                </div>
              </div>
              <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-purple-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.abs(
                        ((stats.currentWeight - stats.goalWeight) /
                          (stats.currentWeight - stats.goalWeight)) *
                          100
                      )
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/app/health/workouts/log"
                className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="text-3xl mb-3">💪</div>
                <h3 className="font-bold mb-1">Log Workout</h3>
                <p className="text-sm text-foreground-muted">Record your training session</p>
                <div className="mt-4 text-green-600 font-mono text-sm group-hover:gap-1 flex items-center transition-all">
                  logWorkout() →
                </div>
              </Link>

              <Link
                href="/app/health/nutrition/log"
                className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="font-bold mb-1">Log Meal</h3>
                <p className="text-sm text-foreground-muted">Track your nutrition</p>
                <div className="mt-4 text-blue-600 font-mono text-sm group-hover:gap-1 flex items-center transition-all">
                  logMeal() →
                </div>
              </Link>

              <Link
                href="/app/health/measurements"
                className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="text-3xl mb-3">📏</div>
                <h3 className="font-bold mb-1">Update Stats</h3>
                <p className="text-sm text-foreground-muted">Log measurements</p>
                <div className="mt-4 text-purple-600 font-mono text-sm group-hover:gap-1 flex items-center transition-all">
                  updateStats() →
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-background/50 border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{activity.title}</div>
                        <div className="text-sm text-foreground-muted">{activity.description}</div>
                      </div>
                      <div className="text-xs text-foreground-subtle font-mono">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-background/50 border border-border rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <p className="text-foreground-muted mb-4">No activity yet. Start your journey!</p>
                  <CodeCTA
                    functionName="logFirstWorkout"
                    href="/app/health/workouts/log"
                    variant="primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Data Insights (Placeholder for charts) */}
          <div className="bg-background/50 border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Progress Charts</h2>
            <div className="text-center py-12 text-foreground-muted">
              <div className="text-4xl mb-4">📈</div>
              <p className="font-mono">Charts coming soon with Recharts integration</p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
