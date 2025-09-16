"use client";

import { Toaster } from "react-hot-toast";
import ChatBot from "./components/chatbot";
import { useState } from "react";
import Intro from "./components_intro/intro";
import Outro from "./components_outro/outro";

import Image from "next/image";

// Flag per abilitare/disabilitare l’intro
const SHOW_INTRO = true;

export default function Home() {
  // se SHOW_INTRO è false → partiamo subito dopo l’intro
  const [showAfterIntro, setShowAfterIntro] = useState(!SHOW_INTRO);

  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-gray-100 px-2 relative">
      <><Outro /></>
    </div>
  );
}
