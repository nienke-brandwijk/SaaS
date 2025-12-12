import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

type Message = { role: 'user' | 'assistant'; content: string };
let conversation: Message[] = [];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }
    conversation.push({ role: 'user', content: message });
    const conversationText = conversation
      .map(msg => `${msg.content}`)
      .join('\n');
    const model = google('gemini-2.5-flash');
    const result = await generateText({
      model,
      prompt: conversationText,
    });
    conversation.push({ role: 'assistant', content: result.text });
    return NextResponse.json({ reply: result.text });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
