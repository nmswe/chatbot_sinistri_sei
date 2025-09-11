"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Intro() {
  const phrases = [
    "Gianluca: Che palle ste attese telefoniche...",
    "Gianluca: Meno male che c’è il gatto a farmi compagnia...",
    "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ...",
    "Voce automatizzata: I nostri operatori sono tutti occupati al momento \n \n Attendere prego ...",
    "Voce automatizzata: I nostri BZZ operatori BZZ sono tutti OccupATi al momento \n \n ZSttendere bzzregO ...",
    "..................",
    "Gianluca: Almeno funzionassero bene questi sistemi, sono sempre sminchiati.."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3500); // cambia frase ogni 3.5 secondi
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative">
        {/* SVG come immagine */}
        <Image
          src="/intro_scenarios/living-room-svg.svg"
          alt="Living room"
          width={400}
          height={400}
        />

        {/* Finestra di dialogo centrata sopra l’SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-xl shadow-lg text-center max-w-[200px]">
            <p className="text-base font-semibold">{phrases[index]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
