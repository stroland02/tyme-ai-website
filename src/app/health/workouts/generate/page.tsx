'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateWorkoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    duration: 30,
    workoutType: 'strength',
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setWorkoutPlan(null);

    try {
      const response = await fetch('/api/health/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate workout');
      }

      setWorkoutPlan(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndView = () => {
    if (workoutPlan?.workout?.id) {
      router.push(`/health/workouts/${workoutPlan.workout.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Workout Generator
          </h1>
          <p className="text-gray-300">
            Let our AI create a personalized workout based on your profile and preferences
          </p>
        </div>

        {/* Configuration Form */}
        {!workoutPlan && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Workout Preferences</h2>

            {/* Duration Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Duration: {formData.duration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15 min</span>
                <span>90 min</span>
              </div>
            </div>

            {/* Workout Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Workout Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'strength', label: 'Strength', icon: '💪' },
                  { value: 'cardio', label: 'Cardio', icon: '🏃' },
                  { value: 'hiit', label: 'HIIT', icon: '⚡' },
                  { value: 'yoga', label: 'Yoga', icon: '🧘' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, workoutType: type.value })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.workoutType === type.value
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Generating your workout...
                </span>
              ) : (
                '✨ Generate Workout'
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Generated Workout Plan */}
        {workoutPlan && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 font-semibold">
                ✅ Workout generated and saved to your account!
              </p>
            </div>

            {/* Workout Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-2">{workoutPlan.plan.name}</h2>
              <div className="flex gap-4 text-sm text-gray-300">
                <span>⏱️ {workoutPlan.workout.durationMin} min</span>
                <span>🏋️ {workoutPlan.workout.exercises?.length || 0} exercises</span>
                <span>💪 {formData.workoutType}</span>
              </div>
            </div>

            {/* Warmup */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2 text-orange-400">🔥 Warmup</h3>
              <p className="text-gray-300">{workoutPlan.plan.warmup}</p>
            </div>

            {/* Exercises */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Exercises</h3>
              <div className="space-y-4">
                {workoutPlan.workout.exercises?.map((exercise: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
                      <span className="text-purple-400 text-sm">
                        {exercise.sets} x {exercise.reps}
                      </span>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-gray-400 mb-2">{exercise.notes}</p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-400">
                      {exercise.weight > 0 && <span>Weight: {exercise.weight} lbs</span>}
                      <span>Rest: {exercise.restTime}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooldown */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">❄️ Cooldown</h3>
              <p className="text-gray-300">{workoutPlan.plan.cooldown}</p>
            </div>

            {/* Tips */}
            {workoutPlan.plan.tips && workoutPlan.plan.tips.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-400">💡 Coaching Tips</h3>
                <ul className="space-y-2">
                  {workoutPlan.plan.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-gray-300 flex gap-2">
                      <span className="text-green-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveAndView}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                View in Workouts
              </button>
              <button
                onClick={() => setWorkoutPlan(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
