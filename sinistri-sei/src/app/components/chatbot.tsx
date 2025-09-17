'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import useChat from '../hook/useChat';
import ChatHeader from './chatHeader';
import { ChatMessage } from '../types/chatTypes/chat';
import { soundtrackMap } from '../utils/soundTraksVillains';
import Spiderman from './spiderman';

interface ChatBotProps {
  onAllVillainsDefeated?: () => void;
}

export default function ChatBot({ onAllVillainsDefeated }: ChatBotProps) {
    const { messages, sendMessage, status, villainState } = useChat();
    const [input, setInput] = useState<string>('');
    const [showLottie, setShowLottie] = useState(false);
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
    }, [villainState.currentIndex, audioUnlocked, villainState.defeatCounter]);

    useEffect(() => {
        if (!villainState) return;
        if (villainState.currentIndex === 0) return;
        setShowLottie(true);
        const timer = setTimeout(() => setShowLottie(false), 2000);
        return () => clearTimeout(timer);
    }, [villainState.currentIndex]);

    useEffect(() => {
        if (villainState?.defeatCounter === 6) {
            onAllVillainsDefeated?.(); // segnala al parent che deve mostrare Outro
        }
    }, [villainState?.defeatCounter, onAllVillainsDefeated]);

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
            {showLottie && (
                <Spiderman />
            )}
        </div>
    );
}
