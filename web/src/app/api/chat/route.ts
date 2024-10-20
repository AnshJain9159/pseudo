/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse, GoogleGenerativeAIStream } from 'ai';

const debug = async (error: any) => {
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });

  if (process.env.NODE_ENV === 'development') {
    console.error('Full error details:', error);
  }
};

export async function POST(req: Request) {
  try {
    // 1. Verify API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY is not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 3. Parse request body
    const body = await req.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid request body: messages array is required');
    }

    // 4. Prepare chat history
    const history = body.messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log('Parsed chat history:', history);
    }

    // 5. Start chat and generate response
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const lastMessage = body.messages[body.messages.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    // 6. Create and return streaming response
    const stream = GoogleGenerativeAIStream(result);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    // Log the error
    await debug(error);

    return new Response(
      JSON.stringify({
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
