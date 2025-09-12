'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import useChat from '../hook/useChat';
import ChatHeader from './chatHeader';
import { ChatMessage } from '../types/chatTypes/chat';
import { soundtrackMap } from '../utils/soundTraksVillains';

export default function ChatBot() {
    const { messages, sendMessage, status, villainState } = useChat();
    const [input, setInput] = useState<string>('');
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    useEffect(() => {
        if (!villainState || !audioUnlocked) return;

        if (villainState.defeatCounter === 6 && villainState.currentIndex === 0) {
            audioRef.current?.pause();
            audioRef.current = null;
            return;
        }

        const audioUrl = soundtrackMap[villainState.currentIndex];
        if (!audioUrl) return;

        audioRef.current?.pause();

        const audio = new Audio(audioUrl);
        audio.loop = true;
        audioRef.current = audio;
        audio.play().catch(err => console.error('Errore riproduzione audio:', err));
    }, [villainState.currentIndex, audioUnlocked]);

    return (
        <div onClick={() => setAudioUnlocked(true)} className="w-full max-w-[600px] h-[650px] bg-white rounded-xl flex flex-col overflow-hidden relative">
            <ChatHeader {...villainState} />

            <ChatMessages
                messages={messages as ChatMessage[]}
                status={status}
                messagesEndRef={messagesEndRef}
                villainState={villainState}
            />

            <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                status={status}
            />
        </div>
    );
}
