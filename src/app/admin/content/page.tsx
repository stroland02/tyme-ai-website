import { prisma } from '@/lib/prisma';
import { FileText, PenSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  const [
    totalProfiles,
    totalWorkouts,
    totalMeals,
    recentWorkouts
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.workout.count(),
    prisma.meal.count(),
    prisma.workout.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        exercises: true
      }
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Content Management</h2>
        <p className="text-foreground-muted mt-2">View and manage user-generated content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-background/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground-subtle">Total Profiles</h3>
            <FileText className="w-4 h-4 text-foreground-muted" />
          </div>
          <div className="text-2xl font-bold">{totalProfiles}</div>
          <p className="text-xs text-foreground-muted mt-1">Active health profiles</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-background/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground-subtle">Total Workouts</h3>
            <PenSquare className="w-4 h-4 text-foreground-muted" />
          </div>
          <div className="text-2xl font-bold">{totalWorkouts}</div>
          <p className="text-xs text-foreground-muted mt-1">Logged by users</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-background/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground-subtle">Total Meals</h3>
            <FileText className="w-4 h-4 text-foreground-muted" />
          </div>
          <div className="text-2xl font-bold">{totalMeals}</div>
          <p className="text-xs text-foreground-muted mt-1">Nutrition entries</p>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="border border-border rounded-xl bg-background/50 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold">Recent Workouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground-subtle font-mono">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Exercises</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkouts.map((workout: any) => (
                <tr key={workout.id} className="border-b border-border hover:bg-foreground/5">
                  <td className="px-6 py-4 font-medium">{workout.user.name || 'Anonymous'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {workout.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted">{workout.exercises.length} exercises</td>
                  <td className="px-6 py-4 text-foreground-muted">{workout.durationMin || 0} min</td>
                  <td className="px-6 py-4 text-foreground-muted font-mono">
                    {new Date(workout.createdAt).toLocaleDateString()}
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
