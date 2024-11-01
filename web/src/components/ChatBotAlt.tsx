'use client'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'
import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat1',
        onError: (error) => {
            console.error('Chat error:', error);
        }
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col h-full bg-black">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-4 p-4">
                    {messages.map((message, i) => (
                        <div
                            key={i}
                            className={`text-sm ${
                                message.role === 'assistant' ? 'text-zinc-300' : 'text-blue-400'
                            }`}
                        >
                            <div className="flex items-start space-x-2">
                                <span className="font-medium min-w-[32px]">
                                    {message.role === 'assistant' ? 'AI:' : 'You:'}
                                </span>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-zinc-500 text-sm flex items-center space-x-2">
                            <span className="animate-pulse">●</span>
                            <span>AI is thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t border-zinc-800">
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
                </div>
            </form>
        </div>
    )
}
 