'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

export default function MeasurementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <CodeLabel index="01">measurements.update()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">Update Measurements</h1>
              <p className="text-foreground-muted mt-2">
                Track your body composition and progress
              </p>
            </div>
            <Link
              href="/app/health/dashboard"
              className="text-sm text-foreground-subtle hover:text-foreground font-mono"
            >
              ← Back to dashboard
            </Link>
          </div>

          <div className="bg-background/50 border border-border rounded-xl p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📏</div>
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-foreground-muted mb-6">
                Measurements tracking module is under development
              </p>
              <Link
                href="/app/health/dashboard"
                className="inline-block px-6 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all"
              >
                goBack()
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
