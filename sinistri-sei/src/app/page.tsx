import { Toaster } from "react-hot-toast";
import ChatBot from "./components/chatbot";
import { useState } from "react";
import Intro from "./components_intro/intro";
import Outro from "./components_outro/outro";

import Image from "next/image";

export default function Home() {
  const [showOutro, setShowOutro] = useState(false);

  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-gray-100 px-2 relative">
      {/*
      <Image
        src="/logo.png"
        alt="Logo"
        width={100}
        height={100}
        className="absolute top-5 left-5"
      />
      <ChatBot />
      <Toaster position="bottom-center" />
      */}
      <Intro onFinish={() => setShowOutro(true)} />
      {showOutro && <Outro />}
    </div>
  );
}
