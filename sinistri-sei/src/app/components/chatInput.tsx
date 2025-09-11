import { useRef, useEffect } from "react";
import { ChatInputProps } from "../types/chatTypes/chat";

export default function ChatInput({ input, setInput, sendMessage, status }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
            textareaRef.current.style.height = newHeight + "px";
        }
    }, [input]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                    sendMessage({ text: input });
                    setInput('');
                }
            }}
            className="flex items-center border-t border-gray-200 p-4 bg-white gap-2"
        >
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) {
                            sendMessage({ text: input });
                            setInput('');
                        }
                    }
                }}
                disabled={status !== 'ready'}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 resize-none overflow-hidden"
                rows={1}
            />
            <button
                type="submit"
                disabled={status !== 'ready' || input.trim() === ''}
                className={`group relative font-bold h-9 w-14 rounded-xl text-sm overflow-hidden transition-all duration-300 cursor-pointer
                    ${status !== 'ready' || input.trim() === '' 
                        ? "bg-[url('/spider_web.svg')] bg-center bg-cover border-2 border-black text-black" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
            >
                <span className={`relative z-10 transition-opacity duration-500
                    ${status === 'ready' && input.trim() !== '' ? "group-hover:opacity-0" : ""}`}
                >
                    Invia
                </span>
                {status === 'ready' && input.trim() !== '' && (
                    <span
                        className="absolute inset-0 bg-[url('/spider_man.svg')] bg-center bg-cover bg-no-repeat
                        translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                    ></span>
                )}
            </button>
        </form>
    );
}
