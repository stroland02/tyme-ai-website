'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { Button } from '@/components/ui/Button';
import { Sparkles, Loader2, Play, Save, ChevronRight, Dumbbell, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedWorkout {
  name: string;
  description: string;
  warmup: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    notes: string;
    rest: number;
  }[];
  cooldown: string;
}

export default function GenerateWorkoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);

  // Form state
  const [type, setType] = useState('strength');
  const [focus, setFocus] = useState('Full Body');
  const [duration, setDuration] = useState('45');
  const [intensity, setIntensity] = useState('Medium');
  const [equipment, setEquipment] = useState('Full Gym');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWorkout(null);

    try {
      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, focus, duration, intensity, equipment }),
      });

      if (!response.ok) throw new Error('Failed to generate workout');
      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = async (shouldStart: boolean) => {
    if (!workout) return;
    setSaving(true);

    try {
      const response = await fetch('/api/health/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: workout.name,
          durationMin: duration,
          notes: `${workout.description}\n\nWarmup: ${workout.warmup}\nCooldown: ${workout.cooldown}`,
          exercises: workout.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            notes: ex.notes
          })),
          completed: false, // Save as planned
          aiGenerated: true
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      const savedWorkout = await response.json();
      
      if (shouldStart) {
        router.push(`/app/health/workouts/${savedWorkout.id}`);
      } else {
        router.push('/app/health/dashboard');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save workout.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <CodeLabel index="04">ai.workout_gen()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
                Smart Generator <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </h1>
              <p className="text-foreground-muted mt-2">
                AI-designed plans based on your constraints
              </p>
            </div>
            <Link href="/app/health/dashboard" className="text-sm text-foreground-subtle hover:text-foreground font-mono">
              ← Back
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <form onSubmit={handleGenerate} className="bg-background/50 border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-foreground-subtle flex items-center gap-2">
                      <Target className="w-4 h-4" /> workout_type
                    </label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="strength">Strength Training</option>
                      <option value="hiit">HIIT / Circuit</option>
                      <option value="cardio">Cardio Focus</option>
                      <option value="flexibility">Flexibility / Yoga</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-mono text-foreground-subtle flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" /> target_focus
                    </label>
                    <select 
                      value={focus}
                      onChange={(e) => setFocus(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="Full Body">Full Body</option>
                      <option value="Upper Body">Upper Body</option>
                      <option value="Lower Body">Lower Body</option>
                      <option value="Core">Core</option>
                      <option value="Push">Push Day</option>
                      <option value="Pull">Pull Day</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-mono text-foreground-subtle flex items-center gap-2">
                        <Clock className="w-4 h-4" /> duration_min
                      </label>
                      <input 
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-mono text-foreground-subtle">intensity</label>
                      <select 
                        value={intensity}
                        onChange={(e) => setIntensity(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="Low">Low (Recovery)</option>
                        <option value="Medium">Medium (Steady)</option>
                        <option value="High">High (Pushing)</option>
                        <option value="Extreme">Extreme (Vom-Com)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-mono text-foreground-subtle">equipment_available</label>
                    <select 
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="Full Gym">Full Gym</option>
                      <option value="Dumbbells Only">Dumbbells Only</option>
                      <option value="Kettlebells Only">Kettlebells Only</option>
                      <option value="Bodyweight Only">Bodyweight Only</option>
                      <option value="Home Gym (Basic)">Home Gym (Basic)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  disabled={loading}
                  className="w-full gap-2 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      designing_plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      generateWorkout()
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Results Preview */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {workout ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-background border border-primary/30 rounded-2xl p-6 space-y-6 shadow-2xl shadow-primary/5 min-h-[500px] flex flex-col"
                  >
                    <div className="space-y-2 border-b border-border pb-4">
                      <h2 className="text-2xl font-bold text-primary">{workout.name}</h2>
                      <p className="text-sm text-foreground-muted italic leading-relaxed">
                        "{workout.description}"
                      </p>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-foreground-subtle mb-3">Exercises</h3>
                        <div className="space-y-3">
                          {workout.exercises.map((ex, i) => (
                            <div key={i} className="bg-foreground/5 rounded-xl p-4 flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold">{ex.name}</div>
                                <div className="text-xs text-foreground-subtle font-mono mt-1">
                                  {ex.sets} sets × {ex.reps} reps • {ex.rest}s rest
                                </div>
                                <div className="text-[10px] text-foreground-muted mt-2 italic leading-tight">
                                  {ex.notes}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl border border-border bg-background/50">
                          <h4 className="text-[10px] font-mono uppercase text-foreground-subtle mb-1">Warmup</h4>
                          <p className="text-xs">{workout.warmup}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-border bg-background/50">
                          <h4 className="text-[10px] font-mono uppercase text-foreground-subtle mb-1">Cooldown</h4>
                          <p className="text-xs">{workout.cooldown}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="md" 
                        onClick={() => saveWorkout(false)}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Plan
                      </Button>
                      <Button 
                        variant="primary" 
                        size="md" 
                        onClick={() => saveWorkout(true)}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start Now
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-background/30 border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center text-3xl">
                      🧘
                    </div>
                    <div className="max-w-xs">
                      <h3 className="font-bold mb-2">Ready to evolve?</h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        Configure your session on the left and I'll architect a personalized plan for you.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
