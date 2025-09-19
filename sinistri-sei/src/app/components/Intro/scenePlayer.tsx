"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { scenes } from "@/app/utils/arrayIntro";
import { IntroProps } from "@/app/types/introTypes/intro";

export default function ScenePlayer({ onFinish }: IntroProps) {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const currentScene = scenes[sceneIndex];
        if (phraseIndex >= currentScene.phrases.length) {
            if (sceneIndex + 1 < scenes.length) {
                setSceneIndex((s) => s + 1);
                setPhraseIndex(0);
            } else {
                audioRef.current?.pause();
                audioRef.current!.currentTime = 0;
                onFinish?.();
            }
        }
    }, [phraseIndex, sceneIndex, onFinish]);

    useEffect(() => {
        const interval = setInterval(() => setPhraseIndex((p) => p + 1), 3500);
        return () => clearInterval(interval);
    }, [sceneIndex]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.src = scenes[sceneIndex].audio;
        audio.loop = true;
        audio.volume = 1.0;
        audio.play().catch(() => console.log("Autoplay bloccato..."));
    }, [sceneIndex]);

    return (
        <div className="relative w-full h-screen">
            <Image
                src={scenes[sceneIndex].svg}
                alt="Scenario"
                fill
                className="object-contain"
            />

            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="bg-white/90 px-6 py-4 rounded-xl shadow-lg max-w-lg text-center">
                    <div className="text-lg font-semibold whitespace-pre-line">
                        {scenes[sceneIndex].phrases[phraseIndex]}
                    </div>
                </div>
            </div>

            <audio ref={audioRef} />
        </div>
    );
}
