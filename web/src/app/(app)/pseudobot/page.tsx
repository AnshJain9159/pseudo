"use client"
import { useChat } from 'ai/react'
import { Bot, User, Send } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { MessageSkeleton } from '@/components/MessageSkeleton'
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
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
    <div className="flex flex-col h-screen px-4 lg:px-16 py-16 bg-gradient-to-b from-gray-900 via-indigo-900 to-blue-900 text-white">
      <header className="p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          Pseudo Bot
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto mt-8">
        <div className="space-y-4 px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`p-4 rounded-lg max-w-[75%] shadow-md ${
                  message.role === 'assistant' ? 'bg-gray-800' : 'bg-blue-600 text-white'
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && <MessageSkeleton />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 shadow-lg rounded-lg mt-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask your coding question..."
            className="flex-1 p-2 rounded-lg border-none bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
