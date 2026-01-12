'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { Button } from '@/components/ui/Button';
import { Sparkles, Loader2, Utensils, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MealPlanGeneratorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    calorieTarget: 2000,
    mealsPerDay: 3,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMealPlan(null);

    try {
      const response = await fetch('/api/health/ai/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setMealPlan(data);
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎',
    };
    return icons[type] || '🍴';
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <Container>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <CodeLabel index="05">ai.meal_planner()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
                Smart Nutrition <Sparkles className="w-6 h-6 text-green-500 animate-pulse" />
              </h1>
              <p className="text-foreground-muted mt-2">
                AI-personalized meal plans based on your goals
              </p>
            </div>
            <Link href="/app/health/dashboard" className="text-sm text-foreground-subtle hover:text-foreground font-mono">
              ← Back
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <form onSubmit={handleGenerate} className="bg-background/50 border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="space-y-4">
                  {/* Calorie Target */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-foreground-subtle flex items-center justify-between">
                      <span>daily_calories</span>
                      <span className="text-primary font-bold">{formData.calorieTarget}</span>
                    </label>
                    <input
                      type="range"
                      min="1200"
                      max="3500"
                      step="100"
                      value={formData.calorieTarget}
                      onChange={(e) =>
                        setFormData({ ...formData, calorieTarget: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    <div className="flex justify-between text-xs text-foreground-subtle font-mono">
                      <span>1,200</span>
                      <span>3,500</span>
                    </div>
                  </div>

                  {/* Meals Per Day */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-foreground-subtle">meals_per_day</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                          className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                            formData.mealsPerDay === num
                              ? 'border-green-500 bg-green-500/20 text-green-400'
                              : 'border-border bg-background hover:border-green-500/50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full gap-2 shadow-lg shadow-green-500/20 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      creating_plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      generateMealPlan()
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 relative">
              <AnimatePresence mode="wait">
                {mealPlan ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Success Message */}
                    <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                      <p className="text-green-200 font-semibold">
                        ✅ Meal plan generated and saved to your account!
                      </p>
                    </div>

                    {/* Nutrition Overview */}
                    <div className="bg-background/50 border border-border rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-500" /> Daily Nutrition
                      </h2>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-background border border-border rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">🔥</div>
                          <div className="text-sm text-foreground-subtle mb-1">Calories</div>
                          <div className="text-xl font-bold">{mealPlan.mealPlan?.totalCalories || formData.calorieTarget}</div>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">🥩</div>
                          <div className="text-sm text-foreground-subtle mb-1">Protein</div>
                          <div className="text-xl font-bold">{mealPlan.mealPlan?.macros?.protein || 0}g</div>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">🍞</div>
                          <div className="text-sm text-foreground-subtle mb-1">Carbs</div>
                          <div className="text-xl font-bold">{mealPlan.mealPlan?.macros?.carbs || 0}g</div>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">🥑</div>
                          <div className="text-sm text-foreground-subtle mb-1">Fats</div>
                          <div className="text-xl font-bold">{mealPlan.mealPlan?.macros?.fats || 0}g</div>
                        </div>
                      </div>
                    </div>

                    {/* Meals */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Today's Meals</h2>
                      <div className="space-y-3">
                        {mealPlan.mealPlan?.meals?.map((meal: any, index: number) => (
                          <div
                            key={index}
                            className="bg-background/50 border border-border rounded-xl p-4 hover:border-green-500/30 transition-all"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-3xl">{getMealIcon(meal.type)}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <span className="text-xs uppercase text-green-500 font-mono font-semibold">
                                      {meal.type}
                                    </span>
                                    <h3 className="text-lg font-bold">{meal.name}</h3>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold">{meal.calories}</div>
                                    <div className="text-xs text-foreground-subtle">cal</div>
                                  </div>
                                </div>

                                <div className="flex gap-4 text-xs text-foreground-subtle font-mono mb-2">
                                  <span>P: {meal.protein}g</span>
                                  <span>C: {meal.carbs}g</span>
                                  <span>F: {meal.fats}g</span>
                                </div>

                                {meal.ingredients && meal.ingredients.length > 0 && (
                                  <div className="text-xs text-foreground-muted">
                                    {meal.ingredients.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => router.push('/app/health/nutrition/log')}
                        className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Utensils className="w-4 h-4" /> View Nutrition Log
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setMealPlan(null)}
                        className="flex-1"
                      >
                        Generate Another
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-background/30 border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                    <div className="max-w-xs">
                      <h3 className="font-bold mb-2">Ready to fuel your day?</h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        Set your calorie target and meal frequency, and I'll create a balanced nutrition plan just for you.
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
