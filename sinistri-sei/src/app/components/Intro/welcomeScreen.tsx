"use client";

import { WelcomeScreenProps } from "@/app/types/introTypes/intro";

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100 gap-6">
            <div className="text-2xl font-bold text-center">Benvenuto nella Sinister S.n.C</div>
                <button
                    onClick={onStart}
                    className="text-white font-semibold px-6 py-3 rounded-lg cursor-pointer
                        bg-gradient-to-r from-red-600 via-red-500 to-blue-600 
                        hover:from-red-700 hover:via-red-600 hover:to-blue-700 
                            transition-all duration-300"
                >
                    Parla con i nostri operatori
                </button>
        </div>
    );
}
