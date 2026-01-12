'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Save,
  Trophy,
  Dumbbell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorkoutData {
  id: string;
  name: string;
  type: string;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
    notes?: string;
  }[];
}

export default function WorkoutTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const workoutId = resolvedParams.id;
  
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/health/workouts/${workoutId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setWorkout(data);
        setIsActive(true); // Start timer automatically
      } catch (error) {
        console.error(error);
        router.push('/app/health/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId, router]);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (index: number) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[index].completed = !newExercises[index].completed;
    setWorkout({ ...workout, exercises: newExercises });
  };

  const updateStats = (index: number, field: string, value: number) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    (newExercises[index] as any)[field] = value;
    setWorkout({ ...workout, exercises: newExercises });
  };

  const finishWorkout = async () => {
    if (!workout) return;
    setIsFinishing(true);

    try {
      const response = await fetch(`/api/health/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          durationMin: Math.floor(timer / 60),
          exercises: workout.exercises.map(ex => ({
            id: ex.id,
            completed: ex.completed,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to finish');
      
      router.push('/app/health/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to save workout session.');
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!workout) return null;

  const activeEx = workout.exercises[activeExerciseIndex];
  const progress = (workout.exercises.filter(ex => ex.completed).length / workout.exercises.length) * 100;

  return (
    <main className="min-h-screen pt-20 pb-20 bg-background text-foreground">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header & Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CodeLabel index="05">session.active = true</CodeLabel>
                <h1 className="text-2xl font-bold mt-1">{workout.name}</h1>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-primary">{formatTime(timer)}</div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className="text-xs font-mono text-foreground-subtle hover:text-foreground flex items-center gap-1 ml-auto"
                >
                  {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isActive ? 'pause_session()' : 'resume_session()'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-foreground-subtle">
                <span>PROGRESS</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-primary h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Exercise Focus */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExerciseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-background/50 border border-border rounded-2xl p-8 shadow-2xl space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">{activeEx.name}</h2>
                <p className="text-foreground-muted">{activeEx.notes || 'Focus on form and controlled movement.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-foreground-subtle uppercase block text-center">Weight (kg)</label>
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => updateStats(activeExerciseIndex, 'weight', Math.max(0, activeEx.weight - 2.5))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5"
                    >-</button>
                    <span className="text-4xl font-bold">{activeEx.weight}</span>
                    <button 
                      onClick={() => updateStats(activeExerciseIndex, 'weight', activeEx.weight + 2.5)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5"
                    >+</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-foreground-subtle uppercase block text-center">Reps</label>
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => updateStats(activeExerciseIndex, 'reps', Math.max(0, activeEx.reps - 1))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5"
                    >-</button>
                    <span className="text-4xl font-bold">{activeEx.reps}</span>
                    <button 
                      onClick={() => updateStats(activeExerciseIndex, 'reps', activeEx.reps + 1)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5"
                    >+</button>
                  </div>
                </div>
              </div>

              <Button 
                variant={activeEx.completed ? "secondary" : "primary"}
                size="lg"
                onClick={() => toggleExercise(activeExerciseIndex)}
                className="w-full h-16 text-xl gap-3"
              >
                {activeEx.completed ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Set Complete
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-6 h-6" />
                    Complete Set
                  </>
                )}
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => setActiveExerciseIndex(Math.max(0, activeExerciseIndex - 1))}
              disabled={activeExerciseIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <div className="flex gap-2">
              {workout.exercises.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === activeExerciseIndex ? "bg-primary w-4" : "bg-border",
                    workout.exercises[i].completed && i !== activeExerciseIndex ? "bg-green-500" : ""
                  )} 
                />
              ))}
            </div>

            {activeExerciseIndex === workout.exercises.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={finishWorkout}
                disabled={isFinishing}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                {isFinishing ? 'Saving...' : 'Finish Workout'} <Save className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setActiveExerciseIndex(Math.min(workout.exercises.length - 1, activeExerciseIndex + 1))}
                className="gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Exercise List */}
          <div className="bg-background/30 border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border font-mono text-xs uppercase text-foreground-subtle">
              Exercise List
            </div>
            <div className="divide-y divide-border">
              {workout.exercises.map((ex, i) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveExerciseIndex(i)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 text-left transition-colors hover:bg-foreground/5",
                    i === activeExerciseIndex ? "bg-foreground/5 border-l-2 border-primary" : ""
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                    ex.completed ? "bg-green-500 border-green-500 text-white" : "border-border"
                  )}>
                    {ex.completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{ex.name}</div>
                    <div className="text-xs text-foreground-muted">{ex.sets} sets × {ex.reps} reps @ {ex.weight}kg</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}