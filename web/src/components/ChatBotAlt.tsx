/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useChat } from 'ai/react';
import { Send, FileText, Download, X } from 'lucide-react'; // Import close icon (X)
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

import { jsPDF } from 'jspdf';
import { ActionButtons } from 'components/ActionButtons';
import { SummaryOutput } from 'components/SummaryOutput';

export default function ChatPage() {
  interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

  const [currentMessage, setCurrentMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState(''); // State to store the summary text
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // State to toggle summary visibility
  const [disableSummary, setDisableSummary] = useState(false); // State to disable summary and enable further chat
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechTimeout = useRef<NodeJS.Timeout>();
  const lastSpeechTime = useRef<number>(0);


  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/ai-chat',
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

  // Initialize speech recognition
    useEffect(() => {
      if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-UK';

          recognition.onresult = (event: { results: Iterable<unknown> | ArrayLike<unknown>; }) => {
              const transcript = Array.from(event.results)
                  .map(result => result[0])
                  .map(result => result.transcript)
                  .join('');
              
              handleInputChange({ target: { value: transcript } } as any);
              lastSpeechTime.current = Date.now();
          };

          recognition.onerror = (event: { error: any; }) => {
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
          utterance.pitch = 7;
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

  const customSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
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

  // Custom TF-IDF Summarization Function with Filtering
  const generateTfidfSummary = (chat: { role: string; content: string }[]): string => {
    const filteredSentences = chat
      .map((message) => message.content)
      .filter(
        (content) =>
          content.length > 2 &&
          !content.toLowerCase().includes("error") &&
          !/^(hi|hello|okay|thanks|bye)$/i.test(content)
      );

    const termFrequency = filteredSentences.map((sentence) => {
      const words = sentence.toLowerCase().split(/\s+/);
      const tf: { [key: string]: number } = {};
      words.forEach((word) => {
        tf[word] = (tf[word] || 0) + 1;
      });
      return tf;
    });

    const documentFrequency: { [key: string]: number } = {};
    termFrequency.forEach((tf) => {
      Object.keys(tf).forEach((word) => {
        if (!documentFrequency[word]) {
          documentFrequency[word] = 0;
        }
        documentFrequency[word] += 1;
      });
    });

    const tfidfScores = filteredSentences.map((sentence, index) => {
      const words = sentence.toLowerCase().split(/\s+/);
      let score = 0;
      words.forEach((word) => {
        const tf = termFrequency[index][word];
        const idf = Math.log(filteredSentences.length / (documentFrequency[word] || 1));
        score += tf * idf;
      });
      return { sentence, score };
    });

    tfidfScores.sort((a, b) => b.score - a.score);
    const topThemes = tfidfScores.slice(0, 3).map((item) => item.sentence);

    return `The conversation focused on the following main points: ${topThemes.join('; ')}.`;
  };

  // Function to generate and display the summary
  const generateSummary = () => {
    const generatedSummary = generateTfidfSummary(chat);
    setSummary(generatedSummary); // Update summary state with generated summary
    setIsSummaryVisible(true); // Show summary section
    setDisableSummary(true); // Disable chat input when summary is visible
  };

  // Reset function to clear chat and summary
  const reset = () => {
    setChat([]);
    setSummary('');
    setIsSummaryVisible(false);
    setDisableSummary(false);
  };

  // Function to copy the summary to the clipboard
  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      console.log("Summary copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy summary:", error);
    }
  };

  // Function to download the summary as a PDF
  const downloadSummaryAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Conversation Summary", 10, 10);

    // Wrap the text to fit within the page width
    const pageWidth = doc.internal.pageSize.getWidth() - 20; // 20 is for padding on both sides
    const wrappedText = doc.splitTextToSize(summary, pageWidth);

    // Add the wrapped text to the PDF starting at position (10, 20)
    doc.text(wrappedText, 10, 20);
    doc.save("summary.pdf");
  };

  // Close summary section and enable chat input
  const closeSummary = () => {
    setIsSummaryVisible(false);
    setDisableSummary(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-4"> {/* Scrollable chat section */}
        {chat.map((message, index) => (
          <div key={index} className="text-sm text-white">
            <div className="flex items-start space-x-4">
              <span className="font-medium flex  min-w-[32px] text-white">
                {message.role === 'assistant' ? 'AI:'  : 'You:'  }
                <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                    className={`ml-2 p-1 rounded-full ${isSpeaking ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
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

      {/* Scrollable Summary Section */}
      {isSummaryVisible && summary && (
        <div className="bg-zinc-900 text-white p-4 rounded mt-4 max-h-40 overflow-y-auto relative">
          <button onClick={closeSummary} className="absolute top-2 right-2 text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
           
            <button
              onClick={downloadSummaryAsPDF}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Download as PDF
            </button>
          </div>
          <SummaryOutput summary={summary} onCopy={handleCopySummary} />

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
            disabled={disableSummary} // Disable input if summary is visible
          />
          <button
              type="button"
              onClick={toggleRecording}
              className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
              } text-white`}
          >
            {isRecording ? (
                <MicOff className="w-4 h-4" />
                  ) : (
                  <Mic className="w-4 h-4" />
                     )}
          </button>
          <button
            type="submit"
            disabled={isLoading || !input.trim() || disableSummary} // Disable button if summary is visible
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={generateSummary}
            disabled={disableSummary} // Disable summary button if summary is already visible
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}


