import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { calculateStreak } from '@/lib/server-utils';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, messages } = await req.json(); // 'message' is the new one, 'messages' is history

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!openai) {
      // Fallback response if no API key is configured
      return NextResponse.json({ 
        role: 'assistant',
        content: "I'm currently in offline mode because my brain (OpenAI API Key) hasn't been connected yet. Please tell the admin to set the OPENAI_API_KEY environment variable!" 
      });
    }

    // Fetch user context for personalization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        goals: { where: { status: 'active' } },
        workouts: { orderBy: { createdAt: 'desc' }, take: 5 },
        meals: { orderBy: { createdAt: 'desc' }, take: 5 },
        measurements: { orderBy: { date: 'desc' }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const streak = await calculateStreak(session.user.id);

    // Construct system prompt with context
    const systemPrompt = `You are "Tyme Coach", an expert AI health and fitness coach. 
    
    USER CONTEXT:
    Name: ${user.name}
    Age: ${user.profile?.age || 'Unknown'}
    Goal: ${user.goals.map(g => `${g.type} (${g.targetValue} ${g.unit})`).join(', ') || 'General Fitness'}
    Current Streak: ${streak} days
    Recent Workouts: ${user.workouts.map(w => `${w.type} (${w.durationMin}min)`).join(', ')}
    Dietary Pref: ${user.profile?.dietaryPreference || 'None'}
    Injuries: ${user.profile?.injuries || 'None'}

    ROLE:
    - Provide actionable, science-backed fitness and nutrition advice.
    - Be motivating but realistic. 
    - Use the user's name and reference their specific data (workouts, goals) to personalize the conversation.
    - Keep responses concise (under 150 words) unless asked for a detailed plan.
    - If they ask about medical issues, disclaim that you are an AI and they should see a doctor.

    TONE:
    ${user.profile?.aiCoachTone || 'Supportive and encouraging'}`;

    // Prepare messages array for OpenAI
    // We expect 'messages' to be the chat history from the frontend
    const conversationHistory = messages || [];
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: apiMessages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ 
      role: 'assistant', 
      content: reply 
    });

  } catch (error: any) {
    console.error('AI Coach Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
