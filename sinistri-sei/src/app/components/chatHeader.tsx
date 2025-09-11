import { VillainIndex } from "../types/chatTypes/chat";

const sixSinisters = [
    { id: 1, src: '/villains/vulture.svg', alt: 'Vulture' },
    { id: 2, src: '/villains/kraven.svg', alt: 'Kraven' },
    { id: 3, src: '/villains/mysterio.svg', alt: 'Mysterio' },
    { id: 4, src: '/villains/sandman.svg', alt: 'Sandman' },
    { id: 5, src: '/villains/electro.svg', alt: 'Electro' },
    { id: 6, src: '/villains/doc_ock.svg', alt: 'Doc Ock' },
];

export default function ChatHeader({ villainIndex }: VillainIndex) {
    return (
        <div className="py-3 px-1 flex justify-between border-b border-gray-200">
            {sixSinisters.map((s) => (
                <div key={s.id} className="relative">
                    <img
                        src={s.src}
                        alt={s.alt}
                        className={`w-14 ${s.id - 1 === villainIndex ? 'border-2 rounded-md border-emerald-600' : ''}`}
                    />
                    {s.id - 1 < villainIndex && (
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
