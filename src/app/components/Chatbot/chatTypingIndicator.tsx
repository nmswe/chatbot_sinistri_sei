export default function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-2 rounded-2xl max-w-[70%] text-sm bg-blue-800 text-white rounded-bl-none shadow-inner">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
}
