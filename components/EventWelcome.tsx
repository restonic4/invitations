"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAssetPath } from "@/utils/asset";

interface EventWelcomeProps {
  title: string;
}

export default function EventWelcome({ title }: EventWelcomeProps) {
  const [stage, setStage] = useState(0); // 0=Init, 1=Move Title/BG, 2=Show Card
  const [exitPhase, setExitPhase] = useState(0); // 0=None, 1=Center Title, 2=Grow/Spin, 3=Shrink

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const rotationAnimRef = useRef<Animation | null>(null);

  useEffect(() => {
    // --- 1. SETUP AUDIO ---
    const audioPath = getAssetPath("sounds/song.mp3");
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    audio.play().catch((e) => console.log("Autoplay prevented:", e));

    // --- 2. SETUP SMOOTH ROTATION (Web Animations API) ---
    if (iconRef.current) {
      // define the animation logic in JS so we can control speed
      const animation = iconRef.current.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        {
          duration: 60000, // Start very slow (60s per rotation)
          iterations: Infinity,
          easing: "linear",
        }
      );
      rotationAnimRef.current = animation;
    }

    // --- 3. ENTRY TIMERS ---
    const moveTimer = setTimeout(() => setStage(1), 500);
    const cardTimer = setTimeout(() => setStage(2), 3500);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(cardTimer);
      audio.pause();
      if (rotationAnimRef.current) rotationAnimRef.current.cancel();
    };
  }, []);

  const handleEnter = () => {
    if (exitPhase > 0) return;

    // --- 1. SLOWER AUDIO FADE (2.5 Seconds) ---
    // We want to go from 0.25 to 0.0 in ~2500ms.
    // Interval 100ms means 25 steps. 0.25 / 25 = 0.01 reduction per step.
    if (audioRef.current) {
      const fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.01) {
          // precise floating point fix
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.01); 
        } else {
          if (audioRef.current) audioRef.current.pause();
          clearInterval(fadeInterval);
        }
      }, 100); 
    }

    // --- 2. ACCELERATE ROTATION ---
    // We increase the playbackRate of the existing animation.
    // 1 = normal (60s), 30 = 30x faster (2s).
    const accelerationInterval = setInterval(() => {
      if (rotationAnimRef.current) {
        const currentRate = rotationAnimRef.current.playbackRate;
        // Cap the speed at 40x
        if (currentRate < 40) {
          // Accelerate exponentially for a "revving up" feel
          rotationAnimRef.current.playbackRate = currentRate * 1.1; 
        } else {
          clearInterval(accelerationInterval);
        }
      }
    }, 100);

    // --- 3. ANIMATION STAGES ---
    
    // Phase 1: Card drops, Title centers
    setExitPhase(1);

    // Phase 2 (Wait 1.5s): Title Fades, Icon Grows
    setTimeout(() => {
      setExitPhase(2);
    }, 1500);

    // Phase 3 (Wait 3.5s): Icon shrinks to nothing (while spinning fast)
    setTimeout(() => {
      setExitPhase(3);
    }, 3500);

    // Phase 4 (Wait 4.5s): Trigger Debug
    setTimeout(() => {
      window.location.href = "https://chaotic-loom.com/register";
    }, 4500);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* --- MASK WRAPPER --- */}
      <div 
        className={`
          absolute inset-0 pointer-events-none z-0
          [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.1)_80%,transparent_95%)]
          transition-opacity duration-[3000ms] ease-in-out
          ${stage >= 1 ? "opacity-50" : "opacity-0"}
        `}
      >
        {/* CONTAINER DIV: Handles Scaling (Growing/Shrinking).
           IMAGE INSIDE: Handles Rotation.
           We separate them so the CSS Scale doesn't override the JS Rotation transform.
        */}
        <div 
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[150vmax] h-[150vmax]
            transition-transform duration-[1000ms] ease-in-out
            ${exitPhase === 2 ? "scale-125" : ""} 
            ${exitPhase === 3 ? "scale-0" : ""} 
          `}
        >
           <img 
             ref={iconRef}
             src={getAssetPath("images/icon.svg")}
             alt="Spinning BG" 
             className="w-full h-full object-contain"
             // No CSS animation class here! We do it in JS.
           />
        </div>
      </div>

      {/* --- TITLE --- */}
      <div
        className={`
          relative z-10 flex flex-col items-center
          transition-all duration-[1000ms] ease-in-out
          ${exitPhase >= 2 ? "scale-0 opacity-0 blur-sm" : 
            exitPhase === 1 ? "translate-y-0 scale-100" : 
            stage >= 1 ? "translate-y-[-35vh]" : "translate-y-0"}
        `}
      >
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {title}
        </h1>
      </div>

      {/* --- CARD --- */}
      <div
        className={`
          absolute z-20 w-[90%] max-w-md
          bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8
          shadow-[0_0_50px_rgba(254,142,193,0.3)]
          flex flex-col items-center text-center
          transition-all duration-1000 ease-out
          ${exitPhase >= 1 
              ? "translate-y-[150%] opacity-0" 
              : (stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0")
          }
        `}
      >
        <h2 className="text-2xl font-bold text-[#FE8EC1] mb-4">BIENVENIDO</h2>
        <p className="text-gray-300 leading-relaxed">
          Sé de los primeros en entrar a esta comunidad y forma parte de nuestra historia. Hoy es un escondite, mañana será leyenda. ¡Créeme, querrás decir que estuviste aquí desde el principio!
        </p>
        
        <button 
            onClick={handleEnter}
            className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
          Empezar
        </button>
      </div>
    </div>
  );
}