"use client";
import { useChat } from 'ai/react';
import { Bot, User, Send } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import { MessageSkeleton } from '@/components/MessageSkeleton';
import { useRef, useEffect, useState } from 'react';

export default function ChatPageAlt() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newChatHistory = [...chatHistory, ...messages];
      setChatHistory(newChatHistory);
      if (messages.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    }
  }, [messages]);

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

  return (
    <div className="flex flex-col pl-4 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      

      {/* Chat messages container with fixed height and scrollable content */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                  message.role === 'assistant' ? 'bg-gray-700' : 'bg-blue-500 text-white'
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-200" />
                </div>
              )}
            </div>
          ))}
          {isLoading && <MessageSkeleton />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form for chat */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 shadow">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything...."
            className="flex-1 p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
  );
}
