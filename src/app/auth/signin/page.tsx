'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to main account dashboard
        router.push('/account');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <CodeLabel index="01" className="mb-4">auth.signIn()</CodeLabel>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-foreground-muted">
                Sign in to continue your fitness journey
              </p>
            </div>

            <div className="bg-background/50 border border-border rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-600 text-sm font-mono">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-mono text-foreground-subtle">
                    // email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-mono text-foreground-subtle">
                    // password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'signIn()'}
                </button>

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-foreground-muted font-mono">
                    {`// Don't have an account?`}
                  </p>
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:underline font-mono text-sm mt-2 inline-block"
                  >
                    createAccount() →
                  </Link>
                </div>
              </form>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-foreground-subtle hover:text-foreground font-mono"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
