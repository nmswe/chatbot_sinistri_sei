'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import ChatHeader from './chatHeader';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import { ChatMessage } from '../types/chat';

export default function ChatBot() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });

    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    return (
        <div className="w-full max-w-[600px] h-[650px] bg-white rounded-xl flex flex-col overflow-hidden">
            <ChatHeader />

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
