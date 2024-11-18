/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useChat } from 'ai/react'
import { Bot, User, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'
import { MessageSkeleton } from '@/components/MessageSkeleton'
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
    interface ChatMessage {
        role: 'user' | 'assistant';
        content: string;
    }

    const [currentMessage, setCurrentMessage] = useState('');
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechTimeout = useRef<NodeJS.Timeout>();
    const lastSpeechTime = useRef<number>(0);

    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/chat1',
        onResponse: async (response) => {
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const clonedResponse = response.clone();
            const reader = clonedResponse.body?.locked ? null : clonedResponse.body?.getReader();
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

                setCurrentMessage(fullMessage);
                setChat((prev) => [
                    ...prev,
                    { role: 'assistant', content: fullMessage }
                ]);
            }
        },
        onFinish: (message) => {
            console.log('Finished message:', message);
        },
        onError: (error) => {
            console.error('Chat error:', error);
        }
    });

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-UK';

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                
                handleInputChange({ target: { value: transcript } } as any);
                lastSpeechTime.current = Date.now();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                if (isRecording) {
                    recognition.start(); // Restart if still recording
                }
            };

            recognition.onspeechend = () => {
                // Set a timeout to stop recording if no speech is detected
                speechTimeout.current = setTimeout(() => {
                    if (Date.now() - lastSpeechTime.current > 2000) {
                        recognition.stop();
                        setIsRecording(false);
                    }
                }, 2000); // Wait 2 seconds after speech ends
            };

            setRecognition(recognition);
        }
    }, [handleInputChange, isRecording]);

    const toggleRecording = () => {
        if (!recognition) {
            console.error('Speech recognition not supported');
            return;
        }

        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            recognition.start();
            setIsRecording(true);
            lastSpeechTime.current = Date.now();
        }
    };

    // Text-to-speech function
    const speakMessage = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            // Remove any markdown or code blocks for cleaner speech
            const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted')
                                .replace(/[*_#`]/g, '')
                                .replace(/\n/g, ' ');

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Text-to-speech not supported');
        }
    };

    // Stop speaking
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat, currentMessage]);

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if (speechTimeout.current) {
                clearTimeout(speechTimeout.current);
            }
        };
    }, []);

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
        if (isRecording) {
            recognition?.stop();
            setIsRecording(false);
        }
        if (isSpeaking) {
            stopSpeaking();
        }
        handleSubmit(e);
        setChat((prev) => [...prev, { role: 'user', content: input }]);
    };

    return (
        <div className="flex flex-col h-screen px-16 py-16 bg-gradient-to-b from-black to-gray-900">
            <header className="p-4 bg-transparent shadow">
                <h1 className="text-2xl font-bold text-center text-white">SOCRATOR</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {chat.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start space-x-2 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div
                                className={`p-3 rounded-lg max-w-[80%] ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        {renderMessageContent(message.content)}
                                    </div>
                                    {message.role === 'assistant' && (
                                        <button
                                            onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                                            className={`ml-2 p-1 rounded-full ${isSpeaking ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-600'}`}
                                        >
                                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
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

            <form onSubmit={customSubmitHandler} className="p-4 bg-transparent shadow">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about sorting algorithms..."
                        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={toggleRecording}
                        className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                        } text-white`}
                    >
                        {isRecording ? (
                            <MicOff className="w-5 h-5" />
                        ) : (
                            <Mic className="w-5 h-5" />
                        )}
                    </button>
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