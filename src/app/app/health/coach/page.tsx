'use client';

import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { AICoachChat } from '@/components/features/AICoachChat';
import Link from 'next/link';

export default function AICoachPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CodeLabel index="03">ai_coach.init()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">Personal Coach</h1>
              <p className="text-foreground-muted mt-2">
                Your 24/7 AI fitness and nutrition expert
              </p>
            </div>
            <Link
              href="/app/health/dashboard"
              className="text-sm text-foreground-subtle hover:text-foreground font-mono"
            >
              ← Back to dashboard
            </Link>
          </div>

          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AICoachChat />
            </div>

            {/* Sidebar / Quick Tips */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span> Suggested Topics
                </h3>
                <ul className="space-y-3">
                  <li className="text-sm text-foreground-muted hover:text-foreground transition-colors cursor-pointer bg-background/50 p-3 rounded-lg border border-border">
                    "Can you analyze my workout history?"
                  </li>
                  <li className="text-sm text-foreground-muted hover:text-foreground transition-colors cursor-pointer bg-background/50 p-3 rounded-lg border border-border">
                    "Suggest a high-protein dinner for tonight"
                  </li>
                  <li className="text-sm text-foreground-muted hover:text-foreground transition-colors cursor-pointer bg-background/50 p-3 rounded-lg border border-border">
                    "Why am I not seeing weight loss progress?"
                  </li>
                  <li className="text-sm text-foreground-muted hover:text-foreground transition-colors cursor-pointer bg-background/50 p-3 rounded-lg border border-border">
                    "Create a 30-minute home workout plan"
                  </li>
                </ul>
              </div>

              <div className="bg-background/50 border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-foreground-subtle">
                  Context Aware
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  I have access to your:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-md border border-green-500/20">Workouts</span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-md border border-blue-500/20">Meals</span>
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-xs rounded-md border border-purple-500/20">Goals</span>
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-600 text-xs rounded-md border border-orange-500/20">Stats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
