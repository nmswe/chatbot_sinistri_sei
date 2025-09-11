'use client';

import { useState, useRef, useEffect } from 'react';
import ChatHeader from './chatHeader';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import { ChatMessage } from '../types/chatTypes/chat';
import useChat from '../hook/useChat';

export default function ChatBot() {
    const { messages, sendMessage, status, villainIndex } = useChat();
    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    return (
        <div className="w-full max-w-[600px] h-[650px] bg-white rounded-xl flex flex-col overflow-hidden relative">
            <ChatHeader villainIndex={villainIndex} />

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
            />
        </div>
    );
}
