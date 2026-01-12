import { prisma } from '@/lib/prisma';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch key metrics
  const [totalUsers, newUsersLast30Days, activeSubs] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.serviceSubscription.count({
      where: { status: 'active' }
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-foreground-muted mt-2">System performance and key metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={totalUsers.toString()} 
          change={`+${newUsersLast30Days} this month`}
          icon={Users}
          trend="up"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$0.00" 
          change="+0% vs last month"
          icon={DollarSign}
          trend="neutral"
        />
        <StatCard 
          title="Active Subscriptions" 
          value={activeSubs.toString()} 
          change="Conversion rate: 0%"
          icon={Activity}
          trend="up"
        />
        <StatCard 
          title="System Health" 
          value="99.9%" 
          change="All systems operational"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Recent Signups Table (Simplified) */}
      <div className="border border-border rounded-xl bg-background/50 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold">Recent Signups</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground-subtle font-mono">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(await prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
              })).map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-foreground/5">
                  <td className="px-6 py-4 font-medium">{user.name || 'Anonymous'}</td>
                  <td className="px-6 py-4 text-foreground-muted">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <div className="p-6 rounded-xl border border-border bg-background/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground-subtle">{title}</h3>
        <Icon className="w-4 h-4 text-foreground-muted" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className={`text-xs ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-foreground-muted'
      }`}>
        {change}
      </p>
    </div>
  );
}
