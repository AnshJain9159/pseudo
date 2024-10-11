/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse, GoogleGenerativeAIStream } from 'ai';

// Add this for better error logging
const debug = async (error: any) => {
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });
};

export async function POST(req: Request) {
  try {
    // 1. Verify API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set');
    }

    // 2. Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 3. Parse request body
    const body = await req.json();
    console.log('Request body:', body);  // Debug log

    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid request body: messages array is required');
    }

    // 4. Prepare chat history (Fix: Ensuring correct role and message structure)
    const history = body.messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role, // Fix: Map 'assistant' to 'model'
      parts: [{ text: msg.content }],  // Content is now an object with a 'text' field
    }));

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

    // Return appropriate error response
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
