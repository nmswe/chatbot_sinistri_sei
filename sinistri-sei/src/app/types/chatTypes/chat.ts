import { Dispatch, SetStateAction, RefObject } from 'react';

export interface ChatMessagePart {
    type: 'text';
    text: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    parts: ChatMessagePart[];
    indexVillainMessage: number;
}

export interface ChatMessageProps {
    message: ChatMessage;
}

export interface ChatMessagesProps {
    messages: ChatMessage[];
    status: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

export interface ChatInputProps {
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    sendMessage: (message: { text: string }) => void;
    status: string;
}

export interface ChatBotProps {
    onAllVillainsDefeated?: () => void;
}
