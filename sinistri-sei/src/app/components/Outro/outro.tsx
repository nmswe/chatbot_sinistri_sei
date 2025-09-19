"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { scenes } from "@/app/utils/arrayOutro";
import { OutroProps } from "@/app/types/outroTypes/outro";

export default function Outro({ onFinish }: OutroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleClick = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const currentScene = scenes[sceneIndex];
    const lastPhraseIndex = currentScene.phrases.length - 1;

    if (phraseIndex < lastPhraseIndex) {
      const interval = setInterval(() => {
        setPhraseIndex((prev) => prev + 1);
      }, 3000);

      return () => clearInterval(interval);
    }

    if (phraseIndex === lastPhraseIndex) {
      const timeout = setTimeout(() => {
        if (sceneIndex + 1 < scenes.length) {
          setSceneIndex((s) => s + 1);
          setPhraseIndex(0);
        } else {
          if (audioRef.current) {
            audioRef.current.loop = false;
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          document.body.onclick = null;
          onFinish?.();
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [sceneIndex, phraseIndex, onFinish]);

  useEffect(() => {
    if (phraseIndex > scenes[sceneIndex].phrases.length - 1) {
      if (sceneIndex + 1 < scenes.length) {
        setSceneIndex((s) => s + 1);
        setPhraseIndex(0);
      }
    }
  }, [phraseIndex, sceneIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;

    audio.src = scenes[sceneIndex].audio;
    audio.volume = 1.0;

    const playAudio = () => {
      audio
        .play()
        .catch(() =>
          console.log("Autoplay bloccato, attendo interazione...")
        );
    };

    playAudio();
  }, [sceneIndex]);

  useEffect(() => {
    const currentScene = scenes[sceneIndex];

    if (sceneIndex === scenes.length - 1 && phraseIndex > currentScene.phrases.length - 1) {
      if (audioRef.current) {
        audioRef.current.loop = false;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      document.body.onclick = null;
      onFinish?.();
    }
  }, [sceneIndex, phraseIndex, onFinish]);

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
