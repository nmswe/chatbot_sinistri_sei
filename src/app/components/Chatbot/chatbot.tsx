'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from './chatInput';
import useChat from '../../hook/useChat';
import ChatHeader from './chatHeader';
import { ChatBotProps, ChatMessage } from '../../types/chatTypes/chat';
import { soundtrackMap } from '../../utils/soundTraksVillains';
import Spiderman from './spiderman';
import ChatMessages from './chatMessages';

/**
 * ChatBot component
 * Handles the villain chat logic, audio playback, and UI interactions.
 * Calls onAllVillainsDefeated() when all villains are beaten,
 * and onReset() to restart the experience.
 */
export default function ChatBot({ onAllVillainsDefeated, onReset }: ChatBotProps) {
    const { messages, sendMessage, status, villainState } = useChat();
    const [input, setInput] = useState<string>('');           // user input text
    const [showLottie, setShowLottie] = useState(false);      // show Spiderman animation
    const [audioUnlocked, setAudioUnlocked] = useState(false); // unlock audio on first click
    const messagesEndRef = useRef<HTMLDivElement>(null);      // for auto-scroll
    const audioRef = useRef<HTMLAudioElement | null>(null);   // soundtrack reference

    // Stop and reset audio
    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    // Play villain soundtrack when state changes
    useEffect(() => {
        if (!villainState || !audioUnlocked) return;

        // Special case: all villains defeated → stop music
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
        audio.play().catch(err => console.error('Audio playback error:', err));
    }, [villainState.currentIndex, audioUnlocked, villainState.defeatCounter]);

    // Show Spiderman animation briefly when villain changes
    useEffect(() => {
        if (!villainState) return;
        if (villainState.currentIndex === 0) return;
        setShowLottie(true);
        const timer = setTimeout(() => setShowLottie(false), 2000);
        return () => clearTimeout(timer);
    }, [villainState.currentIndex]);

    // Trigger event when all villains are defeated
    useEffect(() => {
        if (villainState?.defeatCounter === 6) {
            onAllVillainsDefeated?.();
        }
    }, [villainState?.defeatCounter, onAllVillainsDefeated]);

    return (
        <div
            onClick={() => setAudioUnlocked(true)} // unlock audio on first user click
            className="w-full max-w-[600px] h-[650px] border-4 border-yellow-400 bg-white rounded-xl shadow-[0_0_30px_#facc15] flex flex-col overflow-hidden relative"
        >
            <ChatHeader {...villainState} />
            <ChatMessages
                messages={messages as ChatMessage[]}
                status={status}
                messagesEndRef={messagesEndRef}
            />
            <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                status={status}
                onReset={(e) => onReset(e, stopAudio)}
            />
            {showLottie && <Spiderman />}
        </div>
    );
}
