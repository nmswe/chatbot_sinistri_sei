"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { scenes } from "@/app/utils/arrayIntro";
import { IntroProps } from "@/app/types/introTypes/intro";

/**
 * ScenePlayer component
 * Plays each intro scene (image, phrases, and looping audio).
 * Automatically advances through phrases and scenes,
 * and calls onFinish() when all scenes are completed.
 */
export default function ScenePlayer({ onFinish }: IntroProps) {
    const [sceneIndex, setSceneIndex] = useState(0);   // current scene index
    const [phraseIndex, setPhraseIndex] = useState(0); // current phrase index
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Move to next scene when all phrases are shown
    useEffect(() => {
        const currentScene = scenes[sceneIndex];
        if (phraseIndex >= currentScene.phrases.length) {
            if (sceneIndex + 1 < scenes.length) {
                setSceneIndex((s) => s + 1);
                setPhraseIndex(0);
            } else {
                // End of intro → stop audio and trigger finish
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
                onFinish?.();
            }
        }
    }, [phraseIndex, sceneIndex, onFinish]);

    // Increment phrase index every 5.5s
    useEffect(() => {
        const interval = setInterval(() => setPhraseIndex((p) => p + 1), 5500);
        return () => clearInterval(interval);
    }, [sceneIndex]);

    // Load and play audio for the current scene
    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.src = scenes[sceneIndex].audio;
        audio.loop = true;
        audio.volume = 1.0;
        audio.play().catch(() => console.log("Autoplay blocked..."));
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
                <div className="w-[90%] max-w-2xl px-6 py-4 bg-black/80 border-4 border-yellow-400 shadow-inner rounded-lg flex justify-center items-center">
                    <div className="text-white text-lg font-mono text-center">
                        {scenes[sceneIndex].phrases[phraseIndex]}
                    </div>
                </div>
            </div>
            <audio ref={audioRef} />
            <button
                onClick={onFinish}
                className="
                    absolute bottom-5 right-3
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
                Salta intro
            </button>
        </div>
    );
}
