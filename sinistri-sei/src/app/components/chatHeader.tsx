import { VillainState } from "../types/useChatTypes/useChat";

const sixSinisters = [
    { id: 1, src: '/doc_ock.svg', alt: 'Doc Ock' },
    { id: 2, src: '/electro.svg', alt: 'Electro' },
    { id: 3, src: '/kraven.svg', alt: 'Kraven' },
    { id: 4, src: '/mysterio.svg', alt: 'Mysterio' },
    { id: 5, src: '/vulture.svg', alt: 'Vulture' },
    { id: 6, src: '/sandman.svg', alt: 'Sandman' },
];

export default function ChatHeader(villainState : VillainState) {
    return (
        <div className="py-3 px-1 flex justify-between border-b border-gray-200">
            {sixSinisters.map((s) => (
                <div key={s.id} className="relative">
                    <img
                        src={s.src}
                        alt={s.alt}
                        className={`w-14 ${s.id - 1 === villainState.currentIndex ? 'border-2 rounded-md border-emerald-600' : ''}`}
                    />
                    {s.id - 1 < villainState.currentIndex && (
                        <>
                            <span className="absolute inset-0 flex items-center justify-center text-red-600 text-6xl font-bold pointer-events-none z-10">
                                ✕
                            </span>
                            <img
                                src="/spider_web.svg"
                                alt="Spider Web"
                                className="absolute inset-0 flex items-center justify-center w-16 h-16 pointer-events-none z-20 m-auto"
                            />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
