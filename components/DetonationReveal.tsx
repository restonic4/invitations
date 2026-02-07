"use client";

import React, { useState, useEffect, useRef } from "react";

interface DetonationRevealProps {
  children: React.ReactNode;
}

export default function DetonationReveal({ children }: DetonationRevealProps) {
  const [status, setStatus] = useState<"idle" | "charging" | "detonated">("idle");
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const DURATION = 6000; // 6 seconds

  // --- Initialize and Load Audio ---
  useEffect(() => {
    // Ensure you have this file in your public/sounds folder
    const audio = new Audio("/sounds/bomb.wav"); 
    audio.preload = "auto"; 
    audio.volume = 0.5; 
    audio.load();
    audioRef.current = audio;
  }, []);

  const animate = (time: number) => {
    if (startTimeRef.current === null) startTimeRef.current = time;
    
    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / DURATION, 1);
    const intensity = Math.pow(progress, 4); 
    
    if (progress < 1) {
      // --- 1. VIOLENT SHAKE ---
      const shakeMax = 60 * intensity; 
      const x = (Math.random() - 0.5) * 2 * shakeMax;
      const y = (Math.random() - 0.5) * 2 * shakeMax;
      
      // --- 2. SCALE UP ---
      const scale = 1 + (0.5 * intensity);

      if (buttonRef.current) {
        buttonRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      }

      // --- 3. SPIN ACCELERATION ---
      const baseRotation = elapsed * 0.05; 
      const extraRotation = Math.pow(elapsed, 2) * 0.0008; 
      const totalRotation = baseRotation + extraRotation;

      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${totalRotation}deg)`;
      }

      // --- 4. GLOW INTENSITY ---
      if (glowRef.current) {
        glowRef.current.style.opacity = (0.4 + (0.6 * progress)).toString();
        glowRef.current.style.filter = `blur(${30 + (40 * progress)}px)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    } else {
      // --- DETONATION TIME ---
      setStatus("detonated");
    }
  };

  const handleClick = () => {
    if (status !== "idle") return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
    }

    setStatus("charging");
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] font-sans text-white">
      
      <style jsx>{`
        .broken-ring {
          background: conic-gradient(
            from 0deg, 
            #FE8EC1 0deg 80deg,       
            transparent 80deg 120deg, 
            #AFEC8F 120deg 200deg,    
            transparent 200deg 240deg, 
            #98AFFD 240deg 320deg,    
            transparent 320deg 360deg 
          );
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        /* NEW: Animation for the white flash fading OUT */
        @keyframes flash-fade-out {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        .animate-flash-out {
            animation: flash-fade-out 2.5s ease-out forwards;
        }

        /* NEW: Animation for content fading IN */
        @keyframes content-fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .animate-content-in {
            animation: content-fade-in 3s ease-in forwards;
        }
      `}</style>

      {/* --- BACKGROUND VIGNETTE (Always visible) --- */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]"></div>

      {/* --- PHASE 1: THE BOMB (Visible only until detonation) --- */}
      {status !== 'detonated' && (
        <main className="relative z-20 flex h-full w-full items-center justify-center">
            <button 
            ref={buttonRef}
            onClick={handleClick}
            className="relative group outline-none will-change-transform cursor-pointer"
            >
            {/* Layer 1: Ambient Glow */}
            <div 
                ref={glowRef}
                className="absolute -inset-10 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl bg-gradient-to-r from-[#FE8EC1] via-[#AFEC8F] to-[#98AFFD]"
            ></div>

            {/* Layer 2: The Active Rotating Ring */}
            <div 
                ref={ringRef}
                className={`absolute -inset-[3px] rounded-full broken-ring opacity-90 blur-[1px] ${status === 'idle' ? 'animate-spin-slow' : ''}`}
            ></div>
            
            {/* Layer 3: The Black Core Button */}
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-black flex items-center justify-center shadow-2xl border border-white/5 overflow-hidden">
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)]"></div>
                <span className={`relative z-10 text-xl md:text-2xl font-black tracking-[0.25em] text-white/90 transition-colors ${status === 'charging' ? 'text-red-500' : 'group-hover:text-white'}`}>
                ???
                </span>
            </div>
            </button>
        </main>
      )}

      {/* --- PHASE 2: THE REVEAL (Visible only after detonation) --- */}
      {status === 'detonated' && (
        <>
            {/* The Actual Content (Children) */}
            <div className="relative z-10 h-full w-full animate-content-in overflow-auto">
                {children}
            </div>

            {/* The White Flash Overlay (Starts White -> Fades to Transparent) */}
            <div className="absolute inset-0 bg-white z-[100] pointer-events-none animate-flash-out"></div>
        </>
      )}
    </div>
  );
}