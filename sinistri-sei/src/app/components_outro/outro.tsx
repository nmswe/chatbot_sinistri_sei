"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface OutroProps {
  onFinish?: () => void;
}

type Scene = {
  svg: string;
  audio: string;
  phrases: string[];
};

const scenes: Scene[] = [
  {
    svg: "/outro_scenarios/outro_good_1_sharifa_khatun_vecteezy_clouds-on-blue-sky.svg",
    audio: "/outro_soundtracks/outro_good_Epic Spectrum - Timeless (freetouse.com).mp3",
    phrases: [  
      "Voce Angelica: Congratulazioni sei uscito \n \n dal Limbo delle Attese telefoniche \n \n Benvenuto nel paradiso dei numeri primi in coda",
      "Voce Angelica: Avrai l’onore di essere accolto dalla musa dei clienti in fila. \n \n La sua bellezza è abbagliante, il suo profumo inebriante.",
      "Voce Angelica: Sistemati la camicia, questo è un onore per pochi ...",
    ],
  },
  {
    svg: "/outro_scenarios/outro_bad_1_enaldi_hamid_vecteezy.svg",
    audio: "/outro_soundtracks/outro_bad_Conquest - Blacksmith (freetouse.com).mp3",
    phrases: [
      "Voce Diabolica: Ci avevi sperato!!",
      "NY city è distrutta ed è tutta colpa tua AHAHAH \n \n Rimarrai per sempre bloccato in questo inferno di disperazione!",
      "Sarai nostro per sempre :)"
    ],
  },
];

export default function Outro({ onFinish }: OutroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Abilita audio al primo click
  useEffect(() => {
    const handleClick = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);


  // Avanza frasi
  useEffect(() => {
    const currentScene = scenes[sceneIndex];
    const lastPhraseIndex = currentScene.phrases.length - 1;

    // se NON siamo all'ultima frase → continuo ad avanzare
    if (phraseIndex < lastPhraseIndex) {
      const interval = setInterval(() => {
        setPhraseIndex((prev) => prev + 1);
      }, 3000); // 3 secondi tra le frasi

      return () => clearInterval(interval);
    }

    // se siamo all'ultima frase → attendo prima di cambiare scena
    if (phraseIndex === lastPhraseIndex) {
      const timeout = setTimeout(() => {
        if (sceneIndex + 1 < scenes.length) {
          setSceneIndex((s) => s + 1);
          setPhraseIndex(0);
        } else {
          // ultima scena → finito
          if (audioRef.current) {
            audioRef.current.loop = false;
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          document.body.onclick = null;
          onFinish?.();
        }
      }, 3000); // tempo di visibilità ultima frase

      return () => clearTimeout(timeout);
    }
  }, [sceneIndex, phraseIndex, onFinish]);



  // Controlla passaggio scena
  useEffect(() => {
    if (phraseIndex > scenes[sceneIndex].phrases.length - 1) {
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
  }, [sceneIndex]);

  // Controlla fine scena finale
  useEffect(() => {
    const currentScene = scenes[sceneIndex];

    if (sceneIndex === scenes.length - 1 && phraseIndex > currentScene.phrases.length - 1) {
      if (audioRef.current) {
        audioRef.current.loop = false;   // disattiva loop
        audioRef.current.pause();        // stoppa
        audioRef.current.currentTime = 0; // reset
      }

      // 🔒 rimuovo ogni listener per sempre
      document.body.onclick = null;
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