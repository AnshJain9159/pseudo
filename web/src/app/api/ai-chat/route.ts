/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts

import { StreamingTextResponse } from 'ai';
import { experimental_StreamData } from 'ai';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Convert Ollama response to proper stream format
function createStream(response: Response, data: experimental_StreamData): ReadableStream<Uint8Array> {
  const reader = response.body?.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        data.close(); // Ensure to close the data stream
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            controller.close();
            data.close(); // Close the data stream when finished
            break;
          }

          const text = decoder.decode(value);
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            try {
              const json = JSON.parse(line);
              if (json.response) {
                // Send the chunk in the format expected by useChat
                const chunk = json.response;
                controller.enqueue(encoder.encode(chunk));
              }
            } catch (e) {
              console.warn('Failed to parse JSON:', e);
            }
          }
        }
      } catch (error) {
        controller.error(error);
        data.close(); // Ensure to close the data stream on error
      }
    },
    async cancel() {
      await reader?.cancel();
      data.close(); // Ensure to close the data stream if cancelled
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'hwm:latest',
        prompt: body.messages[body.messages.length - 1].content,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    // Create stream data handler
    const data = new experimental_StreamData();
    
    // Create streaming response with proper headers
    const stream = createStream(response, data);
    
    return new StreamingTextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    }, data);

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
