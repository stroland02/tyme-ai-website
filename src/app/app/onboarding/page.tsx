'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';

interface OnboardingData {
  // Step 1: Basics
  age: number;
  gender: string;
  heightCm: number;
  currentWeight: number;

  // Step 2: Goals
  primaryGoal: string;
  targetWeight?: number;
  deadline?: string;

  // Step 3: Fitness & Schedule
  fitnessLevel: string;
  availableDays: number;
  minutesPerDay: number;

  // Step 4: Diet
  dietaryPreference: string;

  // Step 5: Equipment
  equipment: string[];
}

const STEPS = ['Basics', 'Goals', 'Fitness', 'Diet', 'Equipment'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    age: 25,
    gender: 'prefer_not_to_say',
    heightCm: 170,
    currentWeight: 70,
    primaryGoal: 'general_fitness',
    fitnessLevel: 'beginner',
    availableDays: 3,
    minutesPerDay: 45,
    dietaryPreference: 'omnivore',
    equipment: [],
  });

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEquipment = (item: string) => {
    setData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/app/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <CodeLabel index="01" className="mb-6">user.onboarding()</CodeLabel>
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm ${
                      index <= currentStep
                        ? 'bg-primary text-white'
                        : 'bg-foreground-dim text-foreground-subtle'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-full h-1 mx-2 ${
                        index < currentStep ? 'bg-primary' : 'bg-foreground-dim'
                      }`}
                      style={{ minWidth: '40px' }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <p
                  key={step}
                  className={`text-xs font-mono ${
                    index === currentStep ? 'text-foreground' : 'text-foreground-subtle'
                  }`}
                >
                  {step}
                </p>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-background/50 border border-border rounded-xl p-8 min-h-[500px]">
            {/* Step 1: Basics */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                <p className="text-foreground-muted font-mono text-sm">
                  // Help us personalize your experience
                </p>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-mono text-foreground-subtle">
                      Age
                    </label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => updateData('age', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-mono text-foreground-subtle">
                      Gender
                    </label>
                    <select
                      value={data.gender}
                      onChange={(e) => updateData('gender', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-mono text-foreground-subtle">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={data.heightCm}
                      onChange={(e) => updateData('heightCm', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-mono text-foreground-subtle">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={data.currentWeight}
                      onChange={(e) => updateData('currentWeight', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-2">What's your primary goal?</h2>
                <p className="text-foreground-muted font-mono text-sm">
                  // We'll optimize your plan for this
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { value: 'weight_loss', label: 'Lose Weight', icon: '📉' },
                    { value: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
                    { value: 'strength', label: 'Get Stronger', icon: '🏋️' },
                    { value: 'endurance', label: 'Improve Endurance', icon: '🏃' },
                    { value: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
                    { value: 'general_fitness', label: 'General Fitness', icon: '⚡' },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => updateData('primaryGoal', goal.value)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        data.primaryGoal === goal.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{goal.icon}</div>
                      <div className="font-mono text-sm">{goal.label}</div>
                    </button>
                  ))}
                </div>

                {(data.primaryGoal === 'weight_loss' || data.primaryGoal === 'muscle_gain') && (
                  <div className="mt-8 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-mono text-foreground-subtle">
                        Target Weight (kg) - Optional
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={data.targetWeight || ''}
                        onChange={(e) => updateData('targetWeight', parseFloat(e.target.value))}
                        placeholder="Your goal weight"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-mono text-foreground-subtle">
                        Target Date - Optional
                      </label>
                      <input
                        type="date"
                        value={data.deadline || ''}
                        onChange={(e) => updateData('deadline', e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Fitness & Schedule */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your fitness level</h2>
                  <p className="text-foreground-muted font-mono text-sm">
                    // Be honest - we'll meet you where you are
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
                      { value: 'intermediate', label: 'Intermediate', desc: '6+ months experience' },
                      { value: 'advanced', label: 'Advanced', desc: '2+ years training' },
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => updateData('fitnessLevel', level.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          data.fitnessLevel === level.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-mono text-sm font-bold mb-1">{level.label}</div>
                        <div className="text-xs text-foreground-subtle">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Your schedule</h2>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-mono text-foreground-subtle">
                        Days per week: {data.availableDays}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="7"
                        value={data.availableDays}
                        onChange={(e) => updateData('availableDays', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-foreground-subtle font-mono">
                        <span>1 day</span>
                        <span>7 days</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-mono text-foreground-subtle">
                        Minutes per session: {data.minutesPerDay}
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={data.minutesPerDay}
                        onChange={(e) => updateData('minutesPerDay', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-foreground-subtle font-mono">
                        <span>15 min</span>
                        <span>2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Diet */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-2">Dietary preferences</h2>
                <p className="text-foreground-muted font-mono text-sm">
                  // We'll tailor meal suggestions to your lifestyle
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { value: 'omnivore', label: 'Omnivore', icon: '🍖' },
                    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
                    { value: 'vegan', label: 'Vegan', icon: '🌱' },
                    { value: 'keto', label: 'Keto', icon: '🥑' },
                    { value: 'paleo', label: 'Paleo', icon: '🥩' },
                    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
                  ].map((diet) => (
                    <button
                      key={diet.value}
                      onClick={() => updateData('dietaryPreference', diet.value)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        data.dietaryPreference === diet.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{diet.icon}</div>
                      <div className="font-mono text-sm">{diet.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Equipment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-2">Available equipment</h2>
                <p className="text-foreground-muted font-mono text-sm">
                  // Select all that apply (or none for bodyweight-only)
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { value: 'bodyweight', label: 'Bodyweight Only', icon: '🤸' },
                    { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
                    { value: 'barbell', label: 'Barbell', icon: '⚖️' },
                    { value: 'kettlebells', label: 'Kettlebells', icon: '🔔' },
                    { value: 'resistance_bands', label: 'Resistance Bands', icon: '〰️' },
                    { value: 'pull_up_bar', label: 'Pull-up Bar', icon: '🏗️' },
                    { value: 'full_gym', label: 'Full Gym Access', icon: '🏢' },
                    { value: 'cardio', label: 'Cardio Equipment', icon: '🚴' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => toggleEquipment(item.value)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        data.equipment.includes(item.value)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-mono text-sm">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-6 border-t border-border">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-3 bg-primary text-white font-mono rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
