"use client";

import React, { useEffect, useState } from "react";
import { getAssetPath } from "@/utils/asset";

interface EventWelcomeProps {
  title: string;
}

export default function EventWelcome({ title }: EventWelcomeProps) {
  // Stage 0: Initial (Center text, no background, hidden card)
  // Stage 1: Animation Start (Title moves up, Background fades in)
  // Stage 2: Card Reveal (Card slides up)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 1. Play the music immediately when this component mounts (post-explosion)
    const audioPath = getAssetPath("sounds/song.mp3");
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.25;
    audio.play().catch((e) => console.log("Autoplay prevented:", e));

    // 2. Wait 500ms for the white flash to clear slightly, then start moving title/bg
    const moveTimer = setTimeout(() => {
      setStage(1);
    }, 500);

    // 3. Wait for the move animation (3s) to finish, then show the card
    const cardTimer = setTimeout(() => {
      setStage(2);
    }, 3500); // 500ms delay + 3000ms duration

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(cardTimer);
      audio.pause();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* --- 1. HUGE SPINNING BACKGROUND IMAGE --- */}
      {/* Centered, Huge, Spinning, Fades opacity based on stage */}
      <div 
        className={`
          absolute pointer-events-none z-0
          w-[150vmax] h-[150vmax] /* Huge size to cover everything */
          transition-opacity duration-[3000ms] ease-in-out
          ${stage >= 1 ? "opacity-25" : "opacity-0"}
        `}
      >
         {/* Replace src with your huge image asset */}
         <img 
            src={getAssetPath("images/icon.svg")}
            alt="Spinning BG" 
            className="w-full h-full object-contain animate-spin-very-slow"
         />
      </div>

      {/* --- 2. THE MOVING TITLE --- */}
      <div
        className={`
          relative z-10 flex flex-col items-center
          transition-all duration-[3000ms] ease-in-out
          ${stage >= 1 ? "translate-y-[-35vh]" : "translate-y-0"}
        `}
      >
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {title}
        </h1>
      </div>

      {/* --- 3. THE CARD FROM BELOW --- */}
      <div
        className={`
          absolute z-20 w-[90%] max-w-md
          bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8
          shadow-[0_0_50px_rgba(254,142,193,0.3)]
          flex flex-col items-center text-center
          transition-all duration-1000 ease-out
          ${stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"}
        `}
      >
        <h2 className="text-2xl font-bold text-[#FE8EC1] mb-4">WELCOME</h2>
        <p className="text-gray-300 leading-relaxed">
          The event has officially begun. We are thrilled to have you here.
          Prepare for what comes next.
        </p>
        
        <button className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
          Enter Event
        </button>
      </div>

      {/* Tailwind Custom Animation Style for very slow spin */}
      <style jsx global>{`
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}