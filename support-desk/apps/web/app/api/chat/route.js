import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getRedisClient } from '@/lib/redisClient';
import { supabase } from '@/lib/supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';
const CHAT_HISTORY_LIMIT = Number(process.env.CHAT_HISTORY_LIMIT) || 50;

const KNOWLEDGE_TEXTS = [
  "Our application is a Next.js 16 + Supabase based project that includes authentication, role-based access, and a todo feature.",
  "Regular users can manage only their own todos. Super admins can see all users and their todo counts in an admin panel.",
  "This chat endpoint is a simple AI helper to answer questions about the app and general topics.",
];

function getChatHistoryKey(userId) {
  return `chat:messages:${userId}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body?.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Authenticate user so chat history is per-user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatHistoryKey = getChatHistoryKey(user.id);
    const redis = await getRedisClient();

    let history = [];
    try {
      const rawMessages = await redis.lRange(chatHistoryKey, -10, -1);
      history = rawMessages
        .map((m) => { try { return JSON.parse(m); } catch { return null; } })
        .filter(Boolean);
    } catch (err) {
      console.error('Failed to read chat history from Redis:', err);
    }

    const historyMessages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const knowledgeContent = KNOWLEDGE_TEXTS.join('\n\n');

    const messages = [
      {
        role: 'system',
        content:
          'You are an AI assistant inside a Next.js + Supabase todo application. Be concise and helpful.',
      },
      {
        role: 'system',
        content: `Here is some knowledge about the app:\n\n${knowledgeContent}`,
      },
      ...historyMessages,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    let assistantMessage;

    try {
      const completion = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages,
      });

      assistantMessage =
        completion.choices[0]?.message?.content ||
        "I'm having trouble generating a proper response right now.";
    } catch (err) {
      const requestId = request.headers.get("x-request-id") || "unknown";
      console.error(`[OpenAI error] id=${requestId}:`, err);

      if (err?.status === 429 || err?.code === "insufficient_quota") {
        assistantMessage =
          "The AI service has reached its current quota, so this is a simulated response. " +
          "In a real production environment, this message would come from the OpenAI API.";
      } else {
        assistantMessage =
          "Something went wrong while contacting the AI service. This is a fallback response.";
      }
    }

    const toStore = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantMessage },
    ];

    try {
      for (const msg of toStore) {
        await redis.rPush(chatHistoryKey, JSON.stringify(msg));
      }
      await redis.lTrim(chatHistoryKey, -CHAT_HISTORY_LIMIT, -1);
    } catch (err) {
      console.error('Failed to write chat history to Redis:', err);
    }

    return NextResponse.json({
      reply: assistantMessage,
    });
  } catch (error) {
    const requestId = request.headers.get("x-request-id") || "unknown";
    console.error(`[Error] id=${requestId} in /api/chat:`, error);

    return NextResponse.json(
      { error: "Internal server error", requestId },
      { status: 500 }
    );
  }
}
