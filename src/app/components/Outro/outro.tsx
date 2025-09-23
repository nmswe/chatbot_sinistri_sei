"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { scenes } from "@/app/utils/arrayOutro";
import { OutroProps } from "@/app/types/outroTypes/outro";

/**
 * Outro component
 * Displays a sequence of scenes (image, phrases, and audio).
 * Automatically advances and calls onFinish() when all scenes are done.
 */
export default function Outro({ onFinish }: OutroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);      // current scene index
  const [phraseIndex, setPhraseIndex] = useState(0);    // current phrase in the scene
  const [visible, setVisible] = useState(false);        // for fade-in effect
  const audioRef = useRef<HTMLAudioElement | null>(null); // reference to audio element

  // Trigger fade-in on every scene change
  useEffect(() => {
    setVisible(true);
  }, [sceneIndex]);

  // First user click → unlock audio playback (browser autoplay policy)
  useEffect(() => {
    const handleClick = () => {
      audioRef.current?.play().catch(() => {});
      document.removeEventListener("click", handleClick);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Automatically advance phrases and scenes on a timer
  useEffect(() => {
    const currentScene = scenes[sceneIndex];
    const lastPhraseIndex = currentScene.phrases.length - 1;

    if (phraseIndex < lastPhraseIndex) {
      const interval = setInterval(() => setPhraseIndex((prev) => prev + 1), 5500);
      return () => clearInterval(interval);
    }

    if (phraseIndex === lastPhraseIndex) {
      const timeout = setTimeout(() => {
        if (sceneIndex + 1 < scenes.length) {
          setSceneIndex((s) => s + 1);
          setPhraseIndex(0);
        } else {
          // End of all scenes → stop audio and call onFinish
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          onFinish?.();
        }
      }, 5500);
      return () => clearTimeout(timeout);
    }
  }, [sceneIndex, phraseIndex, onFinish]);

  // Load and play audio for the current scene
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = scenes[sceneIndex].audio;
    audio.volume = 1.0;
    audio.play().catch(() => console.log("Autoplay blocked, waiting for interaction..."));
  }, [sceneIndex]);

  // Fallback: if last scene is finished → stop audio and call onFinish
  useEffect(() => {
    const currentScene = scenes[sceneIndex];
    if (sceneIndex === scenes.length - 1 && phraseIndex > currentScene.phrases.length - 1) {
      audioRef.current?.pause();
      onFinish?.();
    }
  }, [sceneIndex, phraseIndex, onFinish]);

  return (
    <div className={`relative w-full h-screen transition-opacity duration-1000 ${
            visible ? "opacity-100" : "opacity-0"}`}
    >
      <Image
        src={scenes[sceneIndex].svg}
        alt="Scenario"
        fill
        className="object-contain"
      />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-[90%] max-w-lg px-6 py-4 bg-black/80 border-4 border-yellow-400 shadow-inner rounded-lg flex justify-center items-center">
          <div className="text-white text-lg font-mono text-center whitespace-pre-line">
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
        Salta outro
      </button>
    </div>
  );
}
