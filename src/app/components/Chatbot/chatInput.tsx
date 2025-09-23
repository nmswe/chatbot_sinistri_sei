import { useRef, useEffect, useState } from "react";
import { ChatInputProps } from "../../types/chatTypes/chat";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  status,
  onReset,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Local state that decides whether to show the Reset button
  const [dontRestart, setDontRestart] = useState(false);

  useEffect(() => {
    // On component mount, check if "dontRestart" exists in localStorage
    const dontRestart = localStorage.getItem("dontRestart");
    if (dontRestart) {
      // Convert the stored string ("true"/"false") back to a boolean
      setDontRestart(JSON.parse(dontRestart));
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input });
          setInput("");
        }
      }}
      className="
        flex items-center gap-4
        p-4 
        bg-black
        relative
        arcade-frame
      "
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_10px_#facc15]"></div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput("");
            }
          }
        }}
        disabled={status !== "ready"}
        placeholder="Write a message..."
        className="
          flex-1 px-4 py-1 text-sm h-16
          rounded-xl 
          border-4 border-yellow-400
        bg-white
          font-mono
          overflow-y-auto
          resize-none
        "
        rows={1}
      />
      {dontRestart && (
        <button
          type="button"
          onClick={onReset}
          className="
            w-16 h-16 
            rounded-full 
            bg-gradient-to-b from-blue-800 to-black
            border-4 border-white
            shadow-[0_6px_0_#1e3a8a] 
            hover:shadow-[0_2px_0_#1e3a8a] 
            hover:translate-y-1
            active:shadow-[0_0px_0_#1e3a8a] 
            active:translate-y-2 
            flex items-center justify-center 
            text-white font-bold
            transition-all duration-150
            cursor-pointer
            text-sm
            font-mono
          "
        >
          Reset
        </button>
      )}
      <button
        type="submit"
        disabled={status !== "ready" || input.trim() === ""}
        className={`
          group
          relative font-bold 
          h-16 w-16 
          rounded-xl 
          text-sm 
          overflow-hidden 
          transition-all duration-150 
          cursor-pointer
          border-4
          flex items-center justify-center
          ${
              status !== "ready" || input.trim() === ""
              ? "bg-[url('/spider_web.svg')] bg-center bg-cover border-yellow-400 text-yellow-400 shadow-[0_4px_0_#854d0e] cursor-not-allowed"
              : "bg-gradient-to-b from-red-600 to-black border-white text-white shadow-[0_6px_0_#7f1d1d] hover:shadow-[0_3px_0_#7f1d1d] hover:translate-y-1 active:shadow-[0_0px_0_#7f1d1d] active:translate-y-2"
          }
        `}
      >
        <span
          className={`relative z-10 transition-opacity font-mono duration-300 ${
            status === "ready" && input.trim() !== "" ? "group-hover:opacity-0" : ""
          }`}
        >
          Send
        </span>
        {status === "ready" && input.trim() !== "" && (
          <span
            className="absolute inset-0 bg-[url('/spider_man.svg')] bg-center bg-contain bg-no-repeat
              translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
          ></span>
        )}
      </button>
    </form>
  );
}
