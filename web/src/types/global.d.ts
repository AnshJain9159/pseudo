/* eslint-disable @typescript-eslint/no-explicit-any */
// types/global.d.ts
interface Window {
    webkitSpeechRecognition: any;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    error: any;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}