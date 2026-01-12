import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client (only if API key is configured)
export const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate a personalized workout plan using Gemini AI
 */
export async function generateWorkoutPlan(params: {
  fitnessLevel: string;
  goals: string[];
  equipment: string[];
  duration: number;
  workoutType?: string;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.');
  }

  const { fitnessLevel, goals, equipment, duration, workoutType = 'strength' } = params;

  const prompt = `You are an expert fitness coach. Generate a detailed workout plan with the following requirements:

Fitness Level: ${fitnessLevel}
Goals: ${goals.join(', ')}
Available Equipment: ${equipment.join(', ')}
Workout Duration: ${duration} minutes
Workout Type: ${workoutType}

Return a JSON object with this exact structure:
{
  "name": "Brief workout name",
  "warmup": "5-minute warmup description",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "weight": 0,
      "rest": 60,
      "notes": "Form tips and modifications"
    }
  ],
  "cooldown": "5-minute cooldown description",
  "tips": ["Coaching tip 1", "Coaching tip 2"]
}

Make it challenging but achievable for their fitness level. Include proper form cues and safety tips.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    }
  });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Extract JSON from markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || response.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[1]);
}

/**
 * Generate a personalized meal plan using Gemini AI
 */
export async function generateMealPlan(params: {
  dietaryPreference: string;
  goals: string[];
  calorieTarget: number;
  mealsPerDay: number;
  restrictions?: string[];
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.');
  }

  const { dietaryPreference, goals, calorieTarget, mealsPerDay, restrictions = [] } = params;

  const prompt = `You are a registered dietitian. Generate a daily meal plan with the following requirements:

Dietary Preference: ${dietaryPreference}
Goals: ${goals.join(', ')}
Daily Calorie Target: ${calorieTarget} calories
Meals Per Day: ${mealsPerDay}
Restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'None'}

Return a JSON object with this exact structure:
{
  "totalCalories": ${calorieTarget},
  "macros": {
    "protein": 150,
    "carbs": 200,
    "fats": 60
  },
  "meals": [
    {
      "type": "breakfast|lunch|dinner|snack",
      "name": "Meal name",
      "calories": 500,
      "protein": 30,
      "carbs": 50,
      "fats": 15,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "Brief preparation instructions"
    }
  ],
  "shoppingList": ["item 1", "item 2"],
  "tips": ["Nutrition tip 1", "Nutrition tip 2"]
}

Make it balanced, nutritious, and aligned with their goals.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2500,
    }
  });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Extract JSON from markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || response.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[1]);
}

/**
 * Get AI coaching advice using Gemini
 */
export async function getCoachingAdvice(params: {
  userProfile: any;
  question: string;
  context?: string;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.');
  }

  const { userProfile, question, context = '' } = params;

  const systemPrompt = `You are a supportive AI fitness and nutrition coach.

User Profile:
- Fitness Level: ${userProfile.fitnessLevel || 'beginner'}
- Goals: ${userProfile.goals?.map((g: any) => g.description).join(', ') || 'general fitness'}
- Dietary Preference: ${userProfile.dietaryPreference || 'omnivore'}

${context ? `Previous conversation context:\n${context}\n\n` : ''}

Provide personalized, encouraging, and scientifically-backed advice. Keep responses concise (2-3 paragraphs max).

User question: ${question}`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 500,
    }
  });

  const result = await model.generateContent(systemPrompt);
  return result.response.text() || 'I apologize, I could not generate a response.';
}

/**
 * Analyze workout performance and provide feedback
 */
export async function analyzeWorkoutPerformance(params: {
  workouts: any[];
  userProfile: any;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.');
  }

  const { workouts, userProfile } = params;

  const workoutSummary = workouts
    .slice(0, 10)
    .map(
      (w) =>
        `- ${w.type} workout: ${w.durationMin}min, ${w.exercises?.length || 0} exercises, rated ${w.userRating}/10`
    )
    .join('\n');

  const prompt = `Analyze this user's recent workout performance:

${workoutSummary}

User Profile:
- Fitness Level: ${userProfile.fitnessLevel || 'beginner'}
- Goals: ${userProfile.goals?.map((g: any) => g.description).join(', ') || 'general fitness'}

Provide:
1. Overall progress assessment (1-2 sentences)
2. Strengths (1-2 bullet points)
3. Areas for improvement (1-2 bullet points)
4. Specific recommendations (2-3 actionable tips)

Keep it encouraging and constructive.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    }
  });

  const result = await model.generateContent(prompt);
  return result.response.text() || 'Unable to analyze performance at this time.';
}

/**
 * Generate motivational message
 */
export async function generateMotivationalMessage(params: {
  userName: string;
  streak: number;
  recentActivity: string;
  goals: string[];
}) {
  if (!genAI) {
    // Fallback if Gemini not configured
    return `Hey ${params.userName}! You're on a ${params.streak}-day streak! Keep crushing those goals! 💪`;
  }

  const { userName, streak, recentActivity, goals } = params;

  const prompt = `Generate a short, motivational message (1-2 sentences) for ${userName}.

Context:
- Current streak: ${streak} days
- Recent activity: ${recentActivity}
- Goals: ${goals.join(', ')}

Make it personal, energetic, and encouraging. Use emojis sparingly (1-2 max).`;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 100,
      }
    });

    const result = await model.generateContent(prompt);
    return result.response.text() || `Amazing work, ${userName}! ${streak} days strong! 🔥`;
  } catch (error) {
    console.error('Gemini motivation generation failed:', error);
    return `Amazing work, ${userName}! ${streak} days strong! 🔥`;
  }
}
