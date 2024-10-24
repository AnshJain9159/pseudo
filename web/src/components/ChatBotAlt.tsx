"use client";
import { useChat } from 'ai/react';
import { Bot, User, Send } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import { MessageSkeleton } from '@/components/MessageSkeleton';
import { useRef, useEffect, useState } from 'react';

interface ChatBotAltProps {
  copiedText: string | null; // Add prop type for copiedText
}

export default function ChatPageAlt({ copiedText }: ChatBotAltProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to store text when the extension explicitly sends it
  const [extensionCopiedText, setExtensionCopiedText] = useState<string | null>(null);
  
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('chatHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });

  // Listen for messages sent by the Chrome extension
  useEffect(() => {
    // Check if we're in a browser environment and if the 'chrome' object exists
    if (typeof window !== 'undefined' && typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      const listener = (request: any) => {
        if (request.action === 'sendCopiedText') {
          setExtensionCopiedText(request.text); // Set the copied text when the extension sends it
        }
      };
  
      chrome.runtime.onMessage.addListener(listener);
  
      // Clean up the event listener when the component unmounts
      return () => {
        chrome.runtime.onMessage.removeListener(listener);
      };
    }
  }, []);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newChatHistory = [...chatHistory, ...messages];
      setChatHistory(newChatHistory);
      if (messages.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    }
  }, [messages]);

  // Add extensionCopiedText to the message list when it changes
  useEffect(() => {
    if (extensionCopiedText) {
      const newMessage = {
        id: Date.now().toString(), // Generate a unique ID
        role: 'user', // Assuming the copied text is from the user
        content: extensionCopiedText,
      };
      // Append copied text to messages
      setChatHistory((prevChat: any) => [...prevChat, newMessage]);
    }
  }, [extensionCopiedText]);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      <header className="p-4">
        <h1 className="text-3xl font-bold text-center text-gray-100">SOCRATE</h1>
      </header>

      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        <div className="space-y-4">
          {chatHistory.map((message: any) => (
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
