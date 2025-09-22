"use client";

import { WelcomeScreenProps } from "@/app/types/introTypes/intro";

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
            <div className="text-3xl font-mono font-bold text-center tracking-wider">
                Benvenuto nella Sinister S.n.C
            </div>
            <button
                onClick={onStart}
                className="
                    px-4 py-2
                    rounded-full 
                    bg-gradient-to-b from-red-600 to-blue-700
                    border-4 border-white
                    shadow-[0_6px_0_#1e3a8a] 
                    hover:shadow-[0_2px_0_#1e3a8a] 
                    hover:translate-y-1
                    active:shadow-[0_0px_0_#1e3a8a] 
                    active:translate-y-2 
                    text-white font-bold text-lg
                    transition-all duration-150
                    cursor-pointer
                "
            >
                Parla con i nostri operatori
            </button>
        </div>
    );
}
