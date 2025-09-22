"use client";

import { useEffect, useState } from "react";
import Loader from "./loader";
import WelcomeScreen from "./welcomeScreen";
import ScenePlayer from "./scenePlayer";
import { IntroProps } from "@/app/types/introTypes/intro";

export default function Intro({ onFinish }: IntroProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowWelcome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setShowWelcome(false);
  };

  if (showLoader) return <Loader />;
  if (showWelcome) return <WelcomeScreen onStart={handleStart} />;
  if (started) return <ScenePlayer onFinish={onFinish} />;

  return null;
}
