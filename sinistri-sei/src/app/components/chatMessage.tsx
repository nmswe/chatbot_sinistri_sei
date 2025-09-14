import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { handleCopy } from '../utils/functionCopyTexts';
import { MdContentCopy } from "react-icons/md";
import { sixSinisters } from '../utils/arrayVillains';
import { ChatMessageProps } from '../types/chatTypes/chat';

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div
            className={`flex relative pb-3 last:pb-0 ${message.role === 'user' ? 'justify-end' : 'justify-start items-end'
                }`}
        >
            {message.role !== 'user' && sixSinisters[message.indexVillainMessage] && (
                <img
                    src={sixSinisters[message.indexVillainMessage].src}
                    alt={sixSinisters[message.indexVillainMessage].alt}
                    className="w-8 h-8 mr-1"
                />
            )}
            <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm text-gray-800 break-words whitespace-normal overflow-hidden ${message.role === 'user'
                        ? 'bg-[#F4F4F4] rounded-br-none'
                        : 'bg-[#F9F9F9] rounded-bl-none'
                    }`}
            >
                {message.parts.map((part, index) =>
                    part.type === 'text' ? (
                        <div key={index} className={`relative group ${message.role !== 'user' && 'pr-4'}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ node, ...props }) => <span {...props} />,
                                }}
                            >
                                {part.text}
                            </ReactMarkdown>

                            {message.role !== 'user' && (
                                <button
                                    onClick={() => handleCopy(part.text)}
                                    className="absolute top-0 -right-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                                >
                                    <MdContentCopy size={16} />
                                </button>
                            )}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}
