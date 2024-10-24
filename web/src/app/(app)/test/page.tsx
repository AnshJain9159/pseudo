/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useChat } from 'ai/react'
import { Bot, User, Send } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { MessageSkeleton } from '@/components/MessageSkeleton'
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
    const [currentMessage, setCurrentMessage] = useState('');

    const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
        api: '/api/chat1',
        onResponse: async (response) => {
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const clonedResponse = response.clone(); // Clone the response to avoid locking issues
            const reader = clonedResponse.body?.locked ? null : clonedResponse.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    setCurrentMessage((prev) => prev + chunk);
                    console.log(chunk);
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
    }, [messages, currentMessage]);

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

    const customSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitting message:', input);
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-screen px-16 py-16 bg-gradient-to-b from-purple-100 to-indigo-100">
            <header className="p-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-center">Algorithm Tutor</h1>
            </header>

            {/* {error && (
                <div className="p-4 m-4 bg-red-100 text-red-700 rounded-lg">
                    Error: {error.message}
                </div>
            )} */}

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

                    {currentMessage && (
                        <div className="flex items-start space-x-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-3 rounded-lg bg-white max-w-[80%]">
                                <p className="whitespace-pre-wrap">{currentMessage}</p>
                            </div>
                        </div>
                    )}

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
    );
}
