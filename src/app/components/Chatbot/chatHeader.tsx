import { VillainState } from "../../types/useChatTypes/useChat";
import { sixSinisters } from "../../utils/arrayVillains";

export default function ChatHeader(villainState: VillainState) {
  return (
    <div className="flex justify-between items-center px-1 py-3 border-b-4 border-yellow-400 bg-black relative arcade-frame gap-2">
      {sixSinisters.map((s) => (
        <div key={s.id} className="relative flex flex-col items-center">
          <img
            src={s.src}
            alt={s.alt}
            className={`
              w-14 h-14 rounded-lg border-4
              ${s.id - 1 === villainState.currentIndex ? 'border-emerald-500 shadow-[0_0_10px_#34d399]' : 'border-gray-600'}
            `}
          />
          {s.id - 1 < villainState.currentIndex && (
            <>
              <span className="absolute top-1 flex items-center justify-center text-red-600 text-5xl font-bold pointer-events-none z-10">
                ✕
              </span>
              <img
                src="/spider_web.svg"
                alt="Spider Web"
                className="absolute w-16 h-16 pointer-events-none z-20 m-auto opacity-70"
              />
            </>
          )}
          <span className="mt-1 text-xs text-white font-mono">{s.alt}</span>
        </div>
      ))}
    </div>
  );
}
