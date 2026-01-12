'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CodeLabel } from '@/components/ui/CodeLabel';
import { Button } from '@/components/ui/Button';
import { Utensils, Save, Camera } from 'lucide-react';

export default function LogMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Meal state
  const [name, setName] = useState('');
  const [type, setType] = useState('lunch');
  const [calories, setCalories] = useState('500');
  const [protein, setProtein] = useState('30');
  const [carbs, setCarbs] = useState('50');
  const [fats, setFats] = useState('15');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/health/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          calories,
          protein,
          carbs,
          fats,
          description
        }),
      });

      if (!response.ok) throw new Error('Failed to log meal');
      
      router.push('/app/health/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error logging meal:', error);
      alert('Failed to log meal. Please try again.');
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
              <CodeLabel index="02">meal.log()</CodeLabel>
              <h1 className="text-3xl font-bold mt-2">Log Meal</h1>
              <p className="text-foreground-muted mt-2">
                Track your nutrition and macros
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
            {/* Meal Details */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Meal Info
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">meal_name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chicken Salad with Avocado"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-mono text-foreground-subtle">meal_type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              {/* AI Photo Recognition Placeholder */}
              <div className="p-4 border border-dashed border-border rounded-lg bg-foreground-dim/5 flex flex-col items-center justify-center text-center space-y-2">
                <Camera className="w-8 h-8 text-foreground-subtle" />
                <div>
                  <p className="text-sm font-medium">AI Photo Recognition</p>
                  <p className="text-xs text-foreground-subtle">Upload a photo to automatically identify macros (Beta)</p>
                </div>
                <button type="button" className="text-xs text-primary font-mono hover:underline">
                  upload_photo()
                </button>
              </div>
            </div>

            {/* Macros */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold">Nutrition & Macros</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-foreground-subtle">calories</label>
                  <input 
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-foreground-subtle">protein_g</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-foreground-subtle">carbs_g</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-foreground-subtle">fats_g</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description & Submit */}
            <div className="bg-background/50 border border-border rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-foreground-subtle">description (optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any details about the ingredients or portion size?"
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
                  {loading ? 'logging_meal...' : 'log_meal()'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}