"use client";

import { Toaster } from "react-hot-toast";
import ChatBot from "./components/Chatbot/chatbot";
import { useEffect, useState } from "react";
import Intro from "./components/Intro/intro";
import Outro from "./components/Outro/outro";
import Image from "next/image";
import useChat from "./hook/useChat";

export default function Home() {
  const [showAfterIntro, setShowAfterIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const {messages, setMessages, villainState, setVillainState} = useChat();
  const [dontRestart, setDontRestart] = useState(false)

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    const storedVillainState = localStorage.getItem("villainState");
    const dontRestart = localStorage.getItem("dontRestart");

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    if (storedVillainState) {
      setVillainState(JSON.parse(storedVillainState));
    }

    if (dontRestart) {
      setDontRestart(JSON.parse(dontRestart));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 || villainState.defeatCounter > 0 || dontRestart) {
      setShowAfterIntro(true);
    }

    if (villainState.defeatCounter === 6) {
      setShowOutro(true);
    }
  }, [messages, villainState, dontRestart]);

  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-gray-100 px-2 relative">
      {!showAfterIntro && messages.length === 0 && !dontRestart && (
        <Intro onFinish={() => setShowAfterIntro(true)} />
      )}

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
              setShowOutro(true);
          }}
          />
          <Toaster position="bottom-center" />
        </>
      )}

      {showOutro && (
        <Outro onFinish={() => {
          localStorage.setItem("villainState", JSON.stringify({ currentIndex: 0, defeatCounter: 0 }));
          localStorage.setItem("dontRestart", JSON.stringify(true));
          setDontRestart(true)
          setShowOutro(false)}
        } />
      )}
    </div>
  );
}
