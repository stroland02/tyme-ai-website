'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { CodeCTA } from '@/components/ui/CodeCTA';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Activity, Dumbbell, Utensils, Target, TrendingDown, Calendar } from 'lucide-react';

interface DashboardStats {
  streak: number;
  totalWorkouts: number;
  weekWorkouts: number;
  todayCalories: number;
  weeklyGoalProgress: number;
  motivationalMessage: string;
  currentWeight?: number;
  goalWeight?: number;
  recentActivity: any[];
  weightHistory: any[];
  consistencyData: any[];
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

  if (!stats) return null;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CodeLabel index="01">health.dashboard()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">
                Hey {session?.user?.name?.split(' ')[0]}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="text-sm text-foreground-subtle hover:text-foreground font-mono"
              >
                ← Back to account
              </Link>
            </div>
          </div>

          {/* Motivational Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              <div className="md:col-span-3 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono">
                  <Activity className="w-3 h-3" /> system.status: optimal
                </div>
                <p className="text-2xl font-medium leading-tight italic">
                  "{stats.motivationalMessage}"
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border border-white/20">
                <div className="text-sm font-mono opacity-80 mb-1">STREAK</div>
                <div className="text-5xl font-bold mb-1">{stats.streak}</div>
                <div className="text-xs font-mono opacity-80 uppercase tracking-widest">Days Strong</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<Dumbbell className="w-5 h-5" />} 
              label="This Week" 
              value={stats.weekWorkouts} 
              subValue="workouts" 
              color="emerald"
            />
            <StatCard 
              icon={<Calendar className="w-5 h-5" />} 
              label="Total Sessions" 
              value={stats.totalWorkouts} 
              subValue="lifetime" 
              color="blue"
            />
            <StatCard 
              icon={<Utensils className="w-5 h-5" />} 
              label="Calories Today" 
              value={stats.todayCalories} 
              subValue="kcal logged" 
              color="orange"
            />
            <StatCard 
              icon={<Target className="w-5 h-5" />} 
              label="Weekly Goal" 
              value={`${stats.weeklyGoalProgress}%`} 
              subValue="consistency" 
              color="indigo"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weight Chart */}
            <div className="lg:col-span-2 bg-background/50 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" /> Weight History
                </h2>
                <div className="text-sm font-mono text-foreground-subtle">last_30_days</div>
              </div>
              
              <div className="h-[300px] w-full">
                {stats.weightHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.weightHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666', fontSize: 12 }} 
                      />
                      <YAxis 
                        hide 
                        domain={['dataMin - 5', 'dataMax + 5']} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#0070f3" 
                        strokeWidth={3} 
                        dot={{ fill: '#0070f3', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-foreground-muted font-mono text-sm">
                    no_data_available_yet
                  </div>
                )}
              </div>
            </div>

            {/* Consistency Bar Chart */}
            <div className="bg-background/50 border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" /> Consistency
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.consistencyData}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#666', fontSize: 12 }} 
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} content={() => null} />
                    <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
                      {stats.consistencyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.completed ? '#10b981' : '#222'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-foreground-subtle font-mono mt-4">
                Workout completion last 7 days
              </p>
            </div>
          </div>

          {/* Quick Actions & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionCard 
                  href="/app/health/workouts/log" 
                  icon="💪" 
                  title="Log Workout" 
                  desc="Record training" 
                  code="logWorkout()" 
                  color="green" 
                />
                <ActionCard 
                  href="/app/health/nutrition/log" 
                  icon="🍽️" 
                  title="Log Meal" 
                  desc="Track nutrition" 
                  code="logMeal()" 
                  color="blue" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <div className="space-y-3">
                {stats.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="bg-background/30 border border-border rounded-lg p-3 flex items-center gap-3">
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{activity.title}</div>
                      <div className="text-xs text-foreground-muted truncate">{activity.description}</div>
                    </div>
                    <div className="text-[10px] font-mono text-foreground-subtle">
                      {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  const colorMap: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
  };

  return (
    <div className="bg-background/50 border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-sm font-mono text-foreground-subtle mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-foreground-muted font-mono">{subValue}</div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, code, color }: any) {
  const colorMap: any = {
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/50 text-green-600',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50 text-blue-600',
  };

  return (
    <Link href={href} className={`group bg-gradient-to-br border rounded-xl p-5 transition-all hover:shadow-lg ${colorMap[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-xs text-foreground-muted mb-4">{desc}</p>
      <div className={`font-mono text-[10px] flex items-center gap-1 group-hover:gap-2 transition-all ${colorMap[color].split(' ').pop()}`}>
        {code} →
      </div>
    </Link>
  );
}