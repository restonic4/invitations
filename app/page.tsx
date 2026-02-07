"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  // 1. Define specific types for the state
  const [status, setStatus] = useState<"idle" | "charging" | "detonated">("idle");
  
  // 2. Define types for the Refs
  // HTMLButtonElement for the button, HTMLDivElement for the divs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // 3. Define types for the logic refs (number or null)
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const DURATION = 6000; // 6 seconds

  // 4. Type the 'time' argument as a number
  const animate = (time: number) => {
    // 5. Handle the null check for startTime
    if (startTimeRef.current === null) startTimeRef.current = time;
    
    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / DURATION, 1);
    
    // Power 4 makes the curve much steeper at the end
    const intensity = Math.pow(progress, 4); 
    
    if (progress < 1) {
      // --- 1. VIOLENT SHAKE ---
      const shakeMax = 60 * intensity; 
      const x = (Math.random() - 0.5) * 2 * shakeMax;
      const y = (Math.random() - 0.5) * 2 * shakeMax;
      
      // --- 2. SCALE UP ---
      const scale = 1 + (0.5 * intensity);

      // 6. Access .current safely
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
      // --- DETONATION ---
      setStatus("detonated");
    }
  };

  const handleClick = () => {
    if (status !== "idle") return;
    setStatus("charging");
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      // 7. Check if current is not null before cancelling
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] font-sans selection:bg-[#FE8EC1] selection:text-black">
      
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
      `}</style>

      {/* --- VIGNETTE --- */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]"></div>

      {/* --- MAIN CONTENT --- */}
      <main className={`relative z-20 flex h-full w-full items-center justify-center ${status === 'detonated' ? 'opacity-0' : 'opacity-100'}`}>

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
            
            {/* Inner Shadow */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)]"></div>

            {/* Text */}
            <span className={`relative z-10 text-xl md:text-2xl font-black tracking-[0.25em] text-white/90 transition-colors ${status === 'charging' ? 'text-red-500' : 'group-hover:text-white'}`}>
              ???
            </span>
            
          </div>
        </button>

      </main>

      {/* --- FLASHBANG --- */}
      <div className={`absolute inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-75 ease-linear ${status === 'detonated' ? 'opacity-100' : 'opacity-0'}`}></div>
    
    </div>
  );
}