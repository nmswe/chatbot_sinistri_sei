"use client";

import { Toaster } from "react-hot-toast";
import ChatBot from "./components/chatbot";
import { useState } from "react";
import Intro from "./components_intro/intro";
import Outro from "./components_outro/outro";
import Image from "next/image";

// Flag per abilitare/disabilitare l’intro
const SHOW_INTRO = false;
const SHOW_OUTRO = false;

export default function Home() {
  // se SHOW_INTRO è false → partiamo subito dopo l’intro
  const [showAfterIntro, setShowAfterIntro] = useState(!SHOW_INTRO);
  const [showOutro, setShowOutro] = useState(false);

  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-gray-100 px-2 relative">
      {/* INTRO */}
      {SHOW_INTRO && !showAfterIntro && (
        <Intro onFinish={() => setShowAfterIntro(true)} />
      )}

      {/* CHATBOT */}
      {showAfterIntro && !showOutro && (
        <>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="absolute top-5 left-5"
          />
          <ChatBot
            onAllVillainsDefeated={() => {
              if (SHOW_OUTRO) {
                setShowOutro(true);   // mostra Outro
              } else {
                setShowOutro(false);  // resta sul ChatBot
              }
            }} // nuovo callback
          />
          <Toaster position="bottom-center" />
        </>
      )}

      {/* OUTRO */}
      {SHOW_OUTRO && showOutro && (
        <Outro onFinish={() => setShowOutro(false)} />
      )}
    </div>
  );
}
