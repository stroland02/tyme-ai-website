import { type NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { COMPANY_CONTEXT } from '@/lib/chat-data';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      role: 'assistant', 
      content: "I'm currently in demo mode. Please configure the GEMINI_API_KEY to enable my full intelligence." 
    });
  }

  try {
    const { messages } = await req.json();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: COMPANY_CONTEXT
    });

    // Convert message history for Gemini
    // Skip the first message if it's the initial assistant greeting
    // (Gemini requires chat history to start with a user message)
    let historyMessages = messages.slice(0, -1);

    // If first message is from assistant, skip it (it's the initial greeting)
    if (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
      historyMessages = historyMessages.slice(1);
    }

    const chatHistory = historyMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      role: 'assistant', 
      content: text 
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "I'm having trouble thinking right now. Please try again." }, { status: 500 });
  }
}