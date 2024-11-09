/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useChat } from 'ai/react';
import { Send, FileText } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

  const [currentMessage, setCurrentMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState(''); // State to store the summary text
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // State to toggle summary visibility

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat1',
    onResponse: async (response) => {
      const clonedResponse = response.clone();
      const reader = clonedResponse.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullMessage += chunk;
          setCurrentMessage((prev) => prev + chunk);
        }

        // Add the completed message to chat
        setChat((prev) => [
          ...prev,
          { role: 'assistant', content: fullMessage },
        ]);
        setCurrentMessage(''); // Reset currentMessage after adding to chat
      }
    },
    onFinish: (message) => {
      // Optional: Handle any actions after the message is fully received
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, currentMessage]);

  const customSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
    setChat((prev) => [...prev, { role: 'user', content: input }]);
  };

  // Function to generate a notes-style summary of the conversation
  const generateSummary = () => {
    if (!summary) {
      const userNotes = chat
        .filter((message) => message.role === 'user')
        .map((message, index) => `Q${index + 1}: ${message.content}`)
        .join('\n');

      const aiNotes = chat
        .filter((message) => message.role === 'assistant')
        .map((message, index) => `A${index + 1}: ${message.content}`)
        .join('\n');

      const conversationSummary = `### Notes\n\n**User Questions**:\n${userNotes}\n\n**AI Responses**:\n${aiNotes}`;
      setSummary(conversationSummary);
    }

    // Toggle the summary visibility
    setIsSummaryVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {chat.map((message, index) => (
            <div key={index} className="text-sm text-white">
              <div className="flex items-start space-x-2">
                <span className="font-medium min-w-[32px] text-white">
                  {message.role === 'assistant' ? 'AI:' : 'You:'}
                </span>
                <div className="prose prose-invert prose-sm max-w-none text-white">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {/* Display current message */}
          {currentMessage && (
            <div className="text-sm text-white">
              <div className="flex items-start space-x-2">
                <span className="font-medium min-w-[32px] text-white">AI:</span>
                <div className="prose prose-invert prose-sm max-w-none text-white">
                  <ReactMarkdown>{currentMessage}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-zinc-500 text-sm flex items-center space-x-2">
              <span className="animate-pulse">●</span>
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scrollable Notes-Style Summary Section */}
      {isSummaryVisible && summary && (
        <div className="bg-zinc-900 text-white p-4 rounded mt-4 h-40 overflow-y-auto">
          <h2 className="font-bold mb-2">Conversation Notes</h2>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}

      <form onSubmit={customSubmitHandler} className="p-2 border-t border-zinc-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the problem..."
            className="flex-1 bg-zinc-900 text-white text-sm rounded px-3 py-1.5 focus:outline-none border border-zinc-800"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={generateSummary}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 opacity-85"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
