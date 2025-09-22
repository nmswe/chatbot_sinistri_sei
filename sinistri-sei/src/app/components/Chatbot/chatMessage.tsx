import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { handleCopy } from '../../utils/functionCopyTexts';
import { MdContentCopy } from "react-icons/md";
import { sixSinisters } from '../../utils/arrayVillains';
import { ChatMessageProps } from '../../types/chatTypes/chat';

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const bgColor = isUser ? 'bg-red-600' : 'bg-blue-800';
  const textColor = 'text-white';
  const borderClass = isUser ? 'rounde border-l-4 rounded-br-none border-yellow-400' : 'rounded-bl-none border-r-4 border-yellow-400';

  return (
    <div className={`flex relative pb-3 last:pb-0 ${isUser ? 'justify-end' : 'justify-start items-end'}`}>
      {!isUser && sixSinisters[message.indexVillainMessage] && (
        <img
          src={sixSinisters[message.indexVillainMessage].src}
          alt={sixSinisters[message.indexVillainMessage].alt}
          className="w-8 h-8 mr-1 rounded-md border-2 border-white shadow-[0_2px_4px_#000]"
        />
      )}
      <div className={`px-4 py-2 rounded-xl max-w-[70%] text-sm break-words ${bgColor} ${textColor} ${borderClass} shadow-inner`}>
        {message.parts.map((part, index) =>
          part.type === 'text' ? (
            <div key={index} className={`relative group ${!isUser && 'pr-6'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{ p: ({ node, ...props }) => <span {...props} /> }}
              >
                {part.text}
              </ReactMarkdown>
              {!isUser && (
                <button
                  onClick={() => handleCopy(part.text)}
                  className="absolute top-0 -right-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 text-yellow-400 hover:text-white"
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
