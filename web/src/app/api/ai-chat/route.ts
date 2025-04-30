/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts

import { StreamingTextResponse } from 'ai';
import { experimental_StreamData } from 'ai';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildSocraticPrompt(userQuery: string) {
  return `
You are Socrates, an AI tutor specializing in Computer Science. 
Your job is to guide students to deeper understanding using Socratic questioning, analogies, and encouragement. 
The student asked: "${userQuery}"

Respond as a Socratic teacher:
- Acknowledge the student's current understanding.
- Ask guiding, open-ended questions.
- Use relevant analogies from Computer Science.
- Encourage critical thinking and curiosity.
- Keep your tone friendly and supportive.
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userQuery = body.messages?.[body.messages.length - 1]?.content || '';

    if (!userQuery) {
      return new Response(JSON.stringify({ error: 'No user query provided' }), { status: 400 });
    }

    const prompt = buildSocraticPrompt(userQuery);

    // Call Groq API (using Llama-3-8b for example, adjust as needed)
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a Socratic AI tutor for Computer Science.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
      max_tokens: 512,
      temperature: 0.8,
    });

    // Stream the response to the frontend
    const data = new experimental_StreamData();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const chunk of completion) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
        data.close();
      },
      async cancel() {
        data.close();
      }
    });

    return new StreamingTextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    }, data);

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}