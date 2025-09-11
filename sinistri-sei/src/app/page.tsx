import { Toaster } from "react-hot-toast";
import ChatBot from "./components/chatbot";
import Intro from "./components_intro/intro";
import Image from "next/image";

export default function Home() {
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
    </div>
  );
}
