import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          workouts: true,
          meals: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-foreground-muted mt-2">View and manage all registered users.</p>
        </div>
        <div className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
          Add User (Coming Soon)
        </div>
      </div>

      <div className="border border-border rounded-xl bg-background/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground-subtle font-mono">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      {user.name || 'Anonymous'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted">
                    <div className="flex flex-col text-xs">
                      <span>{user._count.workouts} workouts</span>
                      <span>{user._count.meals} meals</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/users/${user.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      View
                    </Link>
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
