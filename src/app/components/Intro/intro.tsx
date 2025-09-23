"use client";

import { useEffect, useState } from "react";
import Loader from "./loader";
import WelcomeScreen from "./welcomeScreen";
import ScenePlayer from "./scenePlayer";
import { IntroProps } from "@/app/types/introTypes/intro";

/**
 * Intro component
 * Shows a loader → welcome screen → plays intro scenes.
 * Calls onFinish() when the intro sequence is done.
 */
export default function Intro({ onFinish }: IntroProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [started, setStarted] = useState(false);

  // Show loader for 2s, then welcome screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowWelcome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // When user presses start → begin scene player
  const handleStart = () => {
    setStarted(true);
    setShowWelcome(false);
  };

  if (showLoader) return <Loader />;
  if (showWelcome) return <WelcomeScreen onStart={handleStart} />;
  if (started) return <ScenePlayer onFinish={onFinish} />;

  return null;
}
