"use client";

import { Toaster } from "react-hot-toast";
import ChatBot from "./components/Chatbot/chatbot";
import { useEffect, useState } from "react";
import Intro from "./components/Intro/intro";
import Outro from "./components/Outro/outro";
import useChat from "./hook/useChat";
import Image from "next/image";

export default function Home() {
  const [showAfterIntro, setShowAfterIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const {messages, setMessages, villainState, setVillainState} = useChat();
  const [dontRestart, setDontRestart] = useState(false)

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>, stopAudio?: () => void) => {
    e.preventDefault();

    if (stopAudio) stopAudio();

    setMessages([]);
    setVillainState({ currentIndex: 0, defeatCounter: 0 });
    setDontRestart(false);
    setShowAfterIntro(false);
    setShowOutro(false);

    localStorage.removeItem("messages");
    localStorage.removeItem("villainState");
    localStorage.removeItem("dontRestart");
  };

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
          <Image src={'/bg.svg'} alt='Image background' className='absolute top-0 left-0 w-full h-full object-cover' width={200} height={200} />
          <ChatBot
            onAllVillainsDefeated={() => {
              setShowOutro(true);
          }}
          onReset={handleReset}
          />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0,0,0,0.85)',
                color: 'white',
                border: '4px solid #facc15',
                padding: '16px',
                fontFamily: 'monospace',
                boxShadow: '0 0 10px #facc15',
                borderRadius: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
              },
              success: {
                style: {
                  background: 'rgba(0,0,0,0.85)',
                  color: '#22c55e',
                }
              }
            }}
          />
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
