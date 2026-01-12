import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  FileText 
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect admin routes
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-mono text-xl font-bold">
            TYME_ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground-subtle hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user.name?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{session.user.name}</div>
              <div className="text-xs text-foreground-muted truncate">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="font-mono text-sm text-foreground-subtle">
            admin.session.active = true
          </h1>
          <Link 
            href="/" 
            className="text-sm text-foreground-subtle hover:text-foreground font-mono flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> exit_admin
          </Link>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
