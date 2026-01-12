import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!openai) {
    return NextResponse.json({
      error: "OpenAI API key not configured. Cannot generate workout."
    }, { status: 503 });
  }

  try {
    const { type, duration, intensity, equipment, focus } = await req.json();

    // Fetch user profile for context
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const prompt = `Generate a structured workout plan for a user with the following details:
    - Type: ${type} (e.g., Strength, Cardio, HIIT)
    - Focus Area: ${focus || 'Full Body'}
    - Duration: ${duration} minutes
    - Intensity: ${intensity || 'Medium'}
    - Available Equipment: ${equipment || userProfile?.equipment || 'Bodyweight'}
    - User Fitness Level: ${userProfile?.fitnessLevel || 'Intermediate'}
    - Injuries: ${userProfile?.injuries || 'None'}

    The output must be valid JSON with the following structure:
    {
      "name": "Creative Workout Name",
      "description": "Brief description of the session",
      "warmup": "Brief warmup instructions",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 12,
          "notes": "Form cues or tempo",
          "rest": 60 (seconds)
        }
      ],
      "cooldown": "Brief cooldown instructions"
    }
    
    Ensure exercises are appropriate for the equipment provided. Do not include markdown formatting (like 

    The response must be a raw JSON string.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert fitness program designer.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Failed to generate content");

    const workoutPlan = JSON.parse(content);

    return NextResponse.json(workoutPlan);

  } catch (error: any) {
    console.error('Workout Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
