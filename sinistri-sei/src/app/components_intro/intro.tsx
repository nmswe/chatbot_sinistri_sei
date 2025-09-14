"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface IntroProps {
  onFinish?: () => void;
}

type Scene = {
  svg: string;
  audio: string;
  phrases: string[];
};

const scenes: Scene[] = [
  {
    svg: "/intro_scenarios/living-room-svg.svg",
    audio: "/intro_soundtracks/intro_scena_1_Another Kid & Pratzapp - Kyoto (freetouse.com).mp3",
    phrases: [  
      "Gianluca: Che palle ste attese telefoniche... \n \n Meno male che c’è il gatto a farmi compagnia...",
      "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ...",
      "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ... X2",
      "Voce automatizzata: I nostri BZZ operatori BZZ sono \n \n tutti OccupATi al momento \n \n ZSttendere bzzregO ...",
      "Gianluca: Almeno funzionassero bene questi sistemi, \n \n sono sempre sminchiati.."
    ],
  },
  {
    svg: "/intro_scenarios/hyperspace_tunnel_ancala_nusantara_vecteezy.svg",
    audio: "/intro_soundtracks/intro_scena_2_Zambolino - Wild Tales (freetouse.com).mp3",
    phrases: [
      "Gianluca: Ouu!! Ma dove sono finito?!?! \n \n Ero a casa fino a poco fa!! ",
      "Il mio gatto???? \n \n Vabbè quello si fa sempre i fatti suoi...",
      "Voce Misteriosa: HAHAHAH Gianluca!! \n \n Finalmente ci rivediamo...",
      "Gianluca: Ma chi sei??",
      "Voce Misteriosa: Non c’è tempo per le domande, oramai è finita!!!! \n \n Bentornato nel \n \n “Limbo dell’attesa telefonica”!!",
      "Ora sei alla nostra mercè, sarai per sempre intrappolato qui \n \n ... A meno che ... \n \n .. !! .. ",
      "No niente scordati di quello che ho detto... \n \n Sarai per sempre in balia dei ... \n \n !!! SINISTRI SEI !!!"
    ],
  },
  {
    svg: "/intro_scenarios/skyline_alex_zelnitskiy_vecteezy.svg",
    audio: "/intro_soundtracks/intro_scena_3_Walen - Castle (freetouse.com).mp3",
    phrases: [
      "Caro Gianluca, ora hai una missione: \n \n devi salvare NY city e forse salverai te stesso. \n \n Buona fortuna."
    ],
  },
];

export default function Intro({ onFinish }: IntroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Avanza frasi
  useEffect(() => {
    // ultima scena → mostra la frase per 5 secondi
    if (sceneIndex === scenes.length - 1) {
      if (phraseIndex === 0) {
        const timeout = setTimeout(() => {
          setPhraseIndex(1); // va oltre l’unica frase
        }, 5000);

        return () => clearTimeout(timeout);
      }
      return;
    }

    // altre scene → avanzamento normale
    const interval = setInterval(() => {
      setPhraseIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [sceneIndex, phraseIndex]);


  // Controlla passaggio scena
  useEffect(() => {
    if (phraseIndex >= scenes[sceneIndex].phrases.length) {
      if (sceneIndex + 1 < scenes.length) {
        setSceneIndex((s) => s + 1);
        setPhraseIndex(0);
      }
    }
  }, [phraseIndex, sceneIndex]);

  // Avvio / Cambio diretto della musica senza fade per scene successive
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // stop diretto della traccia precedente
    audio.pause();
    audio.currentTime = 0;

    // assegna nuova traccia
    audio.src = scenes[sceneIndex].audio;
    audio.volume = 1.0;

    // prova a riprodurre
    const playAudio = () => {
      audio
        .play()
        .catch(() =>
          console.log("Autoplay bloccato, attendo interazione...")
        );
    };

    playAudio();

    // fallback su primo click
    const enableAudio = () => {
      playAudio();
      document.removeEventListener("click", enableAudio);
    };
    document.addEventListener("click", enableAudio);

  }, [sceneIndex]);

  // Controlla fine scena finale
  useEffect(() => {
    const currentScene = scenes[sceneIndex];

    if (sceneIndex === scenes.length - 1 && phraseIndex > currentScene.phrases.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      onFinish?.(); // segnala al genitore che ha finito
    }
  }, [sceneIndex, phraseIndex, onFinish]);


  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative">
        {/* SVG dinamico */}
        <Image
          src={scenes[sceneIndex].svg}
          alt="Scenario"
          width={800}
          height={800}
        />

        {/* Dialog box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-xl shadow-lg text-center max-w-[400px]">
            <div className="text-base font-semibold whitespace-pre-line">
              {scenes[sceneIndex].phrases[phraseIndex]}
            </div>
          </div>
        </div>

        {/* Audio dinamico */}
        <audio ref={audioRef} loop />
      </div>
    </div>
  );
}