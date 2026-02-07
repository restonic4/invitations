"use client";

import React, { useState } from "react";

export default function Home() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] font-sans selection:bg-[#FE8EC1] selection:text-black">
      
      {/* --- CSS STYLES --- */}
      <style jsx>{`
        /* The "Broken" Gradient with your custom colors.
           We use transparent gaps to let the dark background show through.
        */
        .broken-ring {
          background: conic-gradient(
            from 0deg, 
            #FE8EC1 0deg 80deg,      /* Pink */
            transparent 80deg 120deg, /* Broken Gap */
            #AFEC8F 120deg 200deg,   /* Green */
            transparent 200deg 240deg, /* Broken Gap */
            #98AFFD 240deg 320deg,   /* Blue */
            transparent 320deg 360deg /* Broken Gap */
          );
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>

      {/* --- VIGNETTE LAYER --- 
          This creates the "darker" feel by shading the corners pure black 
          and leaving a subtle spotlight in the center.
      */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_80%)]"></div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-20 flex h-full w-full items-center justify-center">

        <button 
          onClick={() => setClicked(true)}
          className={`
            relative group outline-none transition-all duration-1000 ease-in-out
            ${clicked ? 'scale-[50] opacity-0 pointer-events-none' : 'scale-100'}
          `}
        >
          
          {/* Layer 1: Ambient Glow (The colors bleeding into the darkness) */}
          <div className="absolute -inset-10 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl bg-gradient-to-r from-[#FE8EC1] via-[#AFEC8F] to-[#98AFFD]"></div>

          {/* Layer 2: The Rotating Broken Ring */}
          <div className="absolute -inset-[3px] rounded-full broken-ring animate-spin-slow opacity-90 blur-[1px]"></div>
          
          {/* Layer 3: The Reverse Ring (Adds complexity/glitch feel) */}
          <div className="absolute -inset-[3px] rounded-full broken-ring animate-spin-reverse opacity-50 mix-blend-overlay"></div>

          {/* Layer 4: The Black Core Button */}
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-black flex items-center justify-center shadow-2xl border border-white/5 overflow-hidden">
            
            {/* Inner Shadow to make it look like a hole */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)]"></div>

            {/* Text */}
            <span className="relative z-10 text-xl md:text-2xl font-black tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">
              ???
            </span>
            
          </div>
        </button>

      </main>

      {/* --- FLASH TRANSITION OVERLAY --- */}
      <div className={`absolute inset-0 bg-[#FE8EC1] mix-blend-screen pointer-events-none transition-opacity duration-700 z-50 ${clicked ? 'opacity-100' : 'opacity-0'}`}></div>
    
    </div>
  );
}