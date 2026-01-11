'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Create account
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Failed to create account');
      }

      // Auto sign in after signup
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
              <CodeLabel index="01" className="mb-4">user.create()</CodeLabel>
              <h1 className="text-3xl font-bold mb-2">Start Your Journey</h1>
              <p className="text-foreground-muted">
                Create your account and begin transforming your health
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
                    minLength={8}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-mono text-foreground-subtle">
                    // confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                    placeholder="Confirm password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'createAccount()'}
                </button>

                <p className="text-xs text-foreground-subtle text-center font-mono">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-foreground-muted font-mono">
                    // Already have an account?
                  </p>
                  <Link
                    href="/auth/signin"
                    className="text-primary hover:underline font-mono text-sm mt-2 inline-block"
                  >
                    signIn() →
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
