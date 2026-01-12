'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Dumbbell, Save } from 'lucide-react';

interface ExerciseEntry {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function LogWorkoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Workout state
  const [type, setType] = useState('strength');
  const [name, setName] = useState('');
  const [durationMin, setDurationMin] = useState('45');
  const [userRating, setUserRating] = useState('5');
  const [notes, setNotes] = useState('');
  
  // Exercises state
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { id: '1', name: '', sets: '3', reps: '10', weight: '0' }
  ]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: '', sets: '3', reps: '10', weight: '0' }
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const updateExercise = (id: string, field: keyof ExerciseEntry, value: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/health/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Workout`,
          durationMin,
          userRating,
          notes,
          exercises: exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to save workout');
      
      router.push('/app/health/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <CodeLabel index="01">workout.log()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">Log Workout</h1>
              <p className="text-foreground-muted mt-2">
                Track your training session
              </p>
            </div>
            <Link
              href="/app/health/dashboard"
              className="text-sm text-foreground-subtle hover:text-foreground font-mono"
            >
              ← Back to dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Workout Details */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Session Info
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">workout_type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility / Yoga</option>
                    <option value="sport">Sport / Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">workout_name (optional)</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Upper Body Power"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">duration_minutes</label>
                  <input 
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">intensity_rating (1-10)</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={userRating}
                    onChange={(e) => setUserRating(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Exercises</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addExercise}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Exercise
                </Button>
              </div>

              <div className="space-y-4">
                {exercises.map((ex, index) => (
                  <div key={ex.id} className="p-4 border border-border rounded-lg bg-background/30 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <input 
                          type="text"
                          value={ex.name}
                          onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                          placeholder="Exercise name (e.g. Bench Press)"
                          required
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeExercise(ex.id)}
                        className="text-foreground-subtle hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-foreground-subtle">sets</label>
                        <input 
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-foreground-subtle">reps</label>
                        <input 
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-foreground-subtle">weight_kg</label>
                        <input 
                          type="number"
                          step="0.5"
                          value={ex.weight}
                          onChange={(e) => updateExercise(ex.id, 'weight', e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Submit */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-foreground-subtle">notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it feel? Any personal records?"
                  className="w-full h-24 bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'saving_workout...' : 'finish_workout()'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}