import { Dispatch, SetStateAction, RefObject } from 'react';
import { VillainState } from '../useChatTypes/useChat';

export interface ChatMessagePart {
    type: 'text';
    text: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    parts: ChatMessagePart[];
}

export interface ChatMessageProps {
    message: ChatMessage;
    villainState: VillainState;
}

export interface ChatMessagesProps {
    messages: ChatMessage[];
    status: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
    villainState: VillainState;
}

export interface ChatInputProps {
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    sendMessage: (message: { text: string }) => void;
    status: string;
}
