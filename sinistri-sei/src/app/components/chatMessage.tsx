import { ChatMessageProps } from "../types/chat";

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className={`flex relative ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm text-gray-800 break-words whitespace-normal ${
                    message.role === 'user'
                        ? 'bg-[#F4F4F4] rounded-br-none'
                        : 'bg-[#F9F9F9] rounded-bl-none'
                }`}
            >
                {message.parts.map((part, index) =>
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null
                )}
            </div>
        </div>
    );
}
