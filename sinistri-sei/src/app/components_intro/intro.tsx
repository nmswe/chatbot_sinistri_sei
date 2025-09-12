"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

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
      "Gianluca: Che palle ste attese telefoniche...",
      "Gianluca: Meno male che c’è il gatto a farmi compagnia...",
      "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ...",
      "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ...",
      "Voce automatizzata: I nostri BZZ operatori BZZ sono tutti OccupATi al momento \n \n ZSttendere bzzregO ...",
      "..................",
      "Gianluca: Almeno funzionassero bene questi sistemi, sono sempre sminchiati.."
    ],
  },
  {
    svg: "/intro_scenarios/hyperspace_tunnel_ancala_nusantara_vecteezy.svg",
    audio: "/intro_soundtracks/intro_scena_2_Zambolino - Wild Tales (freetouse.com).mp3",
    phrases: [
      "Gianluca: Ouu!! Ma dove sono finito?!?!",
      "Gianluca: Il mio salotto, dov’è??",
      "Gianluca: Il mio gatto???? ...",
      "Gianluca: Vabbè quello si fa sempre i fatti suoi...",
      "Voce Misteriosa: HAHAHAH Gianluca!!",
      "Finalmente ci rivediamo...",
      "Gianluca: Ma chi sei??",
      "Voce Misteriosa: Non c’è tempo per le domande, oramai è finita!!!!",
      "Voce Misteriosa: Bentornato nel “Limbo dell’attesa telefonica”!!",
      "Ora sei alla nostra mercè, sarai per sempre intrappolato qui ...A meno che .. !! .. ",
      "No niente scordati quello che ho detto... Sarai per sempre in balia dei SINISTRI SEI !!!"
    ],
  },
  {
    svg: "/intro_scenarios/skyline_alex_zelnitskiy_vecteezy.svg",
    audio: "/intro_soundtracks/intro_scena_3_Walen - Castle (freetouse.com).mp3",
    phrases: [
      "Caro Gianluca, ora hai una missione, devi salvare NY city e forse salverai te stesso....Buona fortuna."
    ],
  },
];

export default function Intro() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Avanza frasi ogni 2 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Controlla passaggio scena
  useEffect(() => {
    if (phraseIndex >= scenes[sceneIndex].phrases.length) {
      if (sceneIndex + 1 < scenes.length) {
        setSceneIndex((s) => s + 1);
        setPhraseIndex(0);
      } else {
        setPhraseIndex(scenes[sceneIndex].phrases.length - 1);
      }
    }
  }, [phraseIndex, sceneIndex]);

  // Gestione audio con fade out/in
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const fadeOutAndChange = async () => {
      // fade out graduale (da 1 → 0 in 1s)
      let vol = 1.0;
      const step = 0.1;
      const interval = setInterval(() => {
        vol = Math.max(0, vol - step);
        audio.volume = vol;
        if (vol <= 0) {
          clearInterval(interval);

          // cambio traccia
          audio.pause();
          audio.src = scenes[sceneIndex].audio;
          audio.load();
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
        }
      }, 100); // ogni 100ms abbasso di 0.1 → ~1s
    };

    fadeOutAndChange();
  }, [sceneIndex]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative">
        {/* SVG dinamico */}
        <Image
          src={scenes[sceneIndex].svg}
          alt="Scenario"
          width={400}
          height={400}
        />

        {/* Dialog box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-xl shadow-lg text-center max-w-[200px]">
            <p className="text-base font-semibold">
              {scenes[sceneIndex].phrases[phraseIndex]}
            </p>
          </div>
        </div>

        {/* Audio dinamico */}
        <audio ref={audioRef} loop />
      </div>
    </div>
  );
}