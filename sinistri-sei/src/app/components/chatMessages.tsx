import { ChatMessagesProps } from '../types/chat';
import ChatMessage from './chatMessage';
import ChatTypingIndicator from './chatTypingIndicator';
import Image from 'next/image';

export default function ChatMessages({ messages, status, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
            <div className="absolute inset-0">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>

            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}

            {status !== 'ready' && <ChatTypingIndicator />}

            <div ref={messagesEndRef} />
        </div>
    );
}
