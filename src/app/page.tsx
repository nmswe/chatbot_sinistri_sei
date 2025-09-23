"use client";

import { Toaster } from "react-hot-toast";
import ChatBot from "./components/Chatbot/chatbot";
import { useEffect, useState } from "react";
import Intro from "./components/Intro/intro";
import Outro from "./components/Outro/outro";
import useChat from "./hook/useChat";
import Image from "next/image";

export default function Home() {
  // Controls whether to show the main app after intro
  const [showAfterIntro, setShowAfterIntro] = useState(false);
  // Controls whether to show the outro sequence
  const [showOutro, setShowOutro] = useState(false);
  // Global chat state (messages + villain state) comes from the custom hook
  const { messages, setMessages, villainState, setVillainState } = useChat();
  // Flag to skip the intro if user already finished once
  const [dontRestart, setDontRestart] = useState(false);

  // Handle full reset of the app and chat state
  const handleReset = (
    e: React.MouseEvent<HTMLButtonElement>,
    stopAudio?: () => void
  ) => {
    e.preventDefault();

    if (stopAudio) stopAudio();

    // Clear messages and villain progression
    setMessages([]);
    setVillainState({ currentIndex: 0, defeatCounter: 0 });
    setDontRestart(false);
    setShowAfterIntro(false);
    setShowOutro(false);

    // Clear persistence
    localStorage.removeItem("messages");
    localStorage.removeItem("villainState");
    localStorage.removeItem("dontRestart");
  };

  // On first mount, restore state from localStorage
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

  // Decide whether to skip intro and/or trigger outro
  useEffect(() => {
    // If there is already progress or "dontRestart" flag, skip intro
    if (messages.length > 0 || villainState.defeatCounter > 0 || dontRestart) {
      setShowAfterIntro(true);
    }

    // If all villains are defeated, show outro
    if (villainState.defeatCounter === 6) {
      setShowOutro(true);
    }
  }, [messages, villainState, dontRestart]);

  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-gray-100 px-2 relative">
      {/* Show intro only if there's no progress and no "dontRestart" flag */}
      {!showAfterIntro && messages.length === 0 && !dontRestart && (
        <Intro onFinish={() => setShowAfterIntro(true)} />
      )}

      {/* Main chat experience (background + ChatBot + toast system) */}
      {showAfterIntro && !showOutro && (
        <>
          <Image
            src={"/bg.svg"}
            alt="Image background"
            className="absolute top-0 left-0 w-full h-full object-cover invert-[40%] sepia-[10%] saturate-[1000%] hue-rotate-[180deg] brightness-90"
            width={200}
            height={200}
          />
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
                background: "rgba(0,0,0,0.85)",
                color: "white",
                border: "4px solid #facc15",
                padding: "16px",
                fontFamily: "monospace",
                boxShadow: "0 0 10px #facc15",
                borderRadius: "12px",
                fontWeight: "bold",
                textAlign: "center",
              },
              success: {
                style: {
                  background: "rgba(0,0,0,0.85)",
                  color: "#22c55e",
                },
              },
            }}
          />
        </>
      )}

      {/* Outro sequence shown after all villains are defeated */}
      {showOutro && (
        <Outro
          onFinish={() => {
            // After outro, persist "dontRestart" to skip intro next time
            localStorage.setItem(
              "villainState",
              JSON.stringify({ currentIndex: 0, defeatCounter: 0 })
            );
            localStorage.setItem("dontRestart", JSON.stringify(true));
            setDontRestart(true);
            setShowOutro(false);
          }}
        />
      )}
    </div>
  );
}
