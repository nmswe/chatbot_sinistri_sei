import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatMessageProps } from "../types/chatTypes/chat";

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className={`flex relative pb-3 last:pb-0 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm text-gray-800 break-words whitespace-normal overflow-hidden ${
                    message.role === 'user'
                        ? 'bg-[#F4F4F4] rounded-br-none'
                        : 'bg-[#F9F9F9] rounded-bl-none'
                }`}
            >
                {message.parts.map((part, index) =>
                    part.type === 'text' ? (
                        <ReactMarkdown
                            key={index}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                p: ({ node, ...props }) => <span {...props} />,
                            }}
                        >
                            {part.text}
                        </ReactMarkdown>
                    ) : null
                )}
            </div>
        </div>
    );
}
