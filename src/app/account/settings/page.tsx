'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [status, session, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Refresh session
      window.location.reload();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data including workouts, meals, and progress. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      await signOut({ callbackUrl: '/' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted font-mono">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <CodeLabel index="01">account.settings()</CodeLabel>
            <h1 className="text-4xl font-bold">Account Settings</h1>
            <p className="text-foreground-muted font-mono text-sm">
              // Manage your account preferences and security
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-600'
                  : 'bg-red-500/10 border-red-500/20 text-red-600'
              }`}
            >
              <p className="text-sm font-mono">{message.text}</p>
            </div>
          )}

          {/* Profile Settings */}
          <div className="bg-background/50 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-mono text-foreground-subtle">
                  // name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-mono text-foreground-subtle">
                  // email (cannot be changed)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg font-mono text-sm opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-foreground-subtle font-mono">
                  Contact support to change your email address
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'saveChanges()'}
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-background/50 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Security</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div>
                  <h3 className="font-bold mb-1">Password</h3>
                  <p className="text-sm text-foreground-muted">••••••••</p>
                </div>
                <button
                  onClick={() => alert('Password reset functionality coming soon! Contact support for now.')}
                  className="px-4 py-2 text-sm bg-background border border-border hover:border-primary/50 rounded-lg font-mono transition-all"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div>
                  <h3 className="font-bold mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-foreground-muted">Not enabled</p>
                </div>
                <button
                  onClick={() => alert('2FA coming soon!')}
                  className="px-4 py-2 text-sm bg-background border border-border hover:border-primary/50 rounded-lg font-mono transition-all"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Danger Zone</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">Delete Account</h3>
                  <p className="text-sm text-foreground-muted">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg font-mono transition-all disabled:opacity-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="text-center pt-8 border-t border-border">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-foreground-subtle hover:text-foreground font-mono text-sm transition-colors"
            >
              ← Sign out
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
