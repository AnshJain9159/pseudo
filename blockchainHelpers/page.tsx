/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useChat } from 'ai/react'
import { Bot, User, Send } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { MessageSkeleton } from '@/components/MessageSkeleton'
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
  // Add specific configuration to useChat
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentMessage = '';
      let messageId = null;
    
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          // Decode and concatenate the chunk
          const chunk = decoder.decode(value, { stream: true });
          currentMessage += chunk;
    
          // If we are streaming, we want to keep updating the same message.
          if (!messageId) {
            // Append the message once and save the ID
            messageId = `assistant-${Date.now()}`;
            append({ id: messageId, content: chunk, role: 'assistant' });
          } else {
            // Update the existing message
            const messageIndex = messages.findIndex((msg) => msg.id === messageId);
            if (messageIndex !== -1) {
              messages[messageIndex].content = currentMessage;
            }
          }
        }
      }
    },
    
    onFinish: (message) => {
      console.log('Finished message:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });
  
  

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('chatHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  
  // Add another useEffect to handle streaming updates.
  useEffect(() => {
    const updateMessages = async () => {
      if (isLoading) {
        const partialMessage: any[] = []; // Assume this is where you'll store parts as they come
        const intervalId = setInterval(() => {
          if (partialMessage.length > 0) {
            setChatHistory((prev: any) => [...prev, partialMessage.join('')]);
            partialMessage.length = 0; // Clear out after pushing
          }
        }, 100); // Adjust interval as needed
  
        return () => clearInterval(intervalId);
      }
    };
  
    updateMessages();
  }, [isLoading]);

  const stripMarkdown = (content: string) => {
    let strippedContent = content.replace(/(\*\*|__)(.*?)\1/g, '$2');
    strippedContent = strippedContent.replace(/(\*|_)(.*?)\1/g, '$2');
    strippedContent = strippedContent.replace(/^#+\s*(.*)$/gm, '$1');
    return strippedContent;
  };

  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <p key={lastIndex} className="whitespace-pre-wrap">
            {stripMarkdown(content.slice(lastIndex, match.index))}
          </p>
        );
      }

      const [, language = 'plaintext', code] = match;
      parts.push(
        <CodeBlock key={match.index} code={code.trim()} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <p key={lastIndex} className="whitespace-pre-wrap">
          {stripMarkdown(content.slice(lastIndex))}
        </p>
      );
    }

    return parts;
  };

  // Custom submit handler to debug the request
  const customSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting message:', input); // Debug logging
    handleSubmit(e); // Ensure this correctly triggers a POST
  };
  

  return (
    <div className="flex flex-col h-screen px-16 py-16 bg-gradient-to-b from-purple-100 to-indigo-100">
      <header className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-center">Algorithm Tutor</h1>
      </header>

      {error && (
        <div className="p-4 m-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error.message}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
        {messages.map((message) => (
  <div
    key={message.id}
    className={`flex items-start space-x-2 ${
      message.role === 'assistant' ? 'justify-start' : 'justify-end'
    }`}
  >
    {message.role === 'assistant' && (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <Bot className="w-5 h-5 text-white" />
      </div>
    )}
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'
      }`}
    >
      {renderMessageContent(message.content)}
    </div>
    {message.role === 'user' && (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <User className="w-5 h-5 text-gray-600" />
      </div>
    )}
  </div>
))}
          {isLoading && <MessageSkeleton />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={customSubmitHandler} className="p-4 bg-white shadow">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about sorting algorithms..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}