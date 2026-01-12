'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MealPlanGeneratorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    calorieTarget: 2000,
    mealsPerDay: 3,
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
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
      setError(err.message || 'Something went wrong');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-green-400 hover:text-green-300 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            AI Meal Plan Generator
          </h1>
          <p className="text-gray-300">
            Get a personalized daily meal plan based on your dietary preferences and goals
          </p>
        </div>

        {/* Configuration Form */}
        {!mealPlan && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Meal Plan Preferences</h2>

            {/* Calorie Target Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Daily Calorie Target: {formData.calorieTarget} calories
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
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1,200 cal</span>
                <span>3,500 cal</span>
              </div>
            </div>

            {/* Meals Per Day */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Meals Per Day: {formData.mealsPerDay}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                    className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                      formData.mealsPerDay === num
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-green-500/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Generating your meal plan...
                </span>
              ) : (
                '✨ Generate Meal Plan'
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

        {/* Generated Meal Plan */}
        {mealPlan && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 font-semibold">
                ✅ Meal plan generated and saved to your account!
              </p>
            </div>

            {/* Nutrition Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Daily Nutrition Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-gray-400">Calories</div>
                  <div className="text-xl font-bold">
                    {mealPlan.mealPlan.totalCalories || formData.calorieTarget}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="text-2xl mb-1">🥩</div>
                  <div className="text-sm text-gray-400">Protein</div>
                  <div className="text-xl font-bold">
                    {mealPlan.mealPlan.macros?.protein || 0}g
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="text-2xl mb-1">🍞</div>
                  <div className="text-sm text-gray-400">Carbs</div>
                  <div className="text-xl font-bold">
                    {mealPlan.mealPlan.macros?.carbs || 0}g
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="text-2xl mb-1">🥑</div>
                  <div className="text-sm text-gray-400">Fats</div>
                  <div className="text-xl font-bold">
                    {mealPlan.mealPlan.macros?.fats || 0}g
                  </div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Meals</h2>
              {mealPlan.mealPlan.meals?.map((meal: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getMealIcon(meal.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs uppercase text-green-400 font-semibold">
                            {meal.type}
                          </span>
                          <h3 className="text-xl font-bold">{meal.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{meal.calories}</div>
                          <div className="text-xs text-gray-400">calories</div>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="flex gap-4 text-sm text-gray-300 mb-3">
                        <span>Protein: {meal.protein}g</span>
                        <span>Carbs: {meal.carbs}g</span>
                        <span>Fats: {meal.fats}g</span>
                      </div>

                      {/* Ingredients */}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-green-400 mb-1">
                            Ingredients:
                          </h4>
                          <div className="text-sm text-gray-300">
                            {meal.ingredients.join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      {meal.instructions && (
                        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                          <h4 className="text-sm font-semibold text-green-400 mb-1">
                            Preparation:
                          </h4>
                          <p className="text-sm text-gray-300">{meal.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopping List */}
            {mealPlan.mealPlan.shoppingList && mealPlan.mealPlan.shoppingList.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-400">
                  🛒 Shopping List
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mealPlan.mealPlan.shoppingList.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 rounded px-3 py-2 text-sm text-gray-300"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Tips */}
            {mealPlan.mealPlan.tips && mealPlan.mealPlan.tips.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">💡 Nutrition Tips</h3>
                <ul className="space-y-2">
                  {mealPlan.mealPlan.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-gray-300 flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/health/nutrition')}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                View in Nutrition Log
              </button>
              <button
                onClick={() => setMealPlan(null)}
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
