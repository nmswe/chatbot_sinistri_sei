"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const phrases = [

];

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

  // Avanza le frasi ogni 2 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Controlla se siamo alla fine delle frasi della scena → passa alla prossima
  useEffect(() => {
    if (phraseIndex >= scenes[sceneIndex].phrases.length) {
      if (sceneIndex + 1 < scenes.length) {
        setSceneIndex((s) => s + 1);
        setPhraseIndex(0); // riparte dal primo messaggio della nuova scena
      } else {
        // ultima scena: ferma sull’ultima frase
        setPhraseIndex(scenes[sceneIndex].phrases.length - 1);
      }
    }
  }, [phraseIndex, sceneIndex]);

  // Gestione audio al cambio scena
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = scenes[sceneIndex].audio;
    audioRef.current.load();

    const playAudio = () => {
      audioRef.current
        ?.play()
        .catch(() => console.log("Autoplay bloccato, attendo interazione..."));
    };

    playAudio();

    const enableAudio = () => {
      playAudio();
      document.removeEventListener("click", enableAudio);
    };
    document.addEventListener("click", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
    };
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
