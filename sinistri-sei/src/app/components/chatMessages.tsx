import { ChatMessagesProps } from '../types/chatTypes/chat';
import ChatMessage from './chatMessage';
import ChatTypingIndicator from './chatTypingIndicator';

export default function ChatMessages({ messages, status, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}

            {status !== 'ready' && <ChatTypingIndicator />}

            <div ref={messagesEndRef} />
        </div>
    );
}
