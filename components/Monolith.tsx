import React from 'react';

export const Monolith: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none">
      {/* The Monolith Container */}
      <div className="relative w-full max-w-game-board h-[500px]">
        {/* Obsidian/Liquid Glass Body */}
        <div className="absolute inset-0 bg-black border border-white/10 shadow-2xl overflow-hidden rounded-sm backdrop-blur-sm">

          {/* Deep Volumetric Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-black to-[#050505] opacity-90"></div>

          {/* Subtile geometric texture overlay - Tech/Carbon feel */}
          <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-screen"></div>

          {/* The Core Light - Volumetric Pulse with CSS breathing */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF0000] rounded-full blur-[2px] animate-breathe"
            style={{
              boxShadow: `0 0 60px rgba(220, 38, 38, 0.7), inset 0 0 20px rgba(255, 200, 200, 0.5)`
            }}
          ></div>

          {/* Liquid Glass Reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-40"></div>

          {/* Internal Scanlines - Finer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40"></div>

          {/* Vertical Polish Line */}
          <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-50"></div>
        </div>

        {/* Aura / Radiation - Pure CSS breathing */}
        <div className="absolute inset-0 bg-[#FF0000] blur-[80px] -z-10 animate-breathe opacity-40"></div>

        {/* Ground Reflection - Sharp wet look */}
        <div className="absolute -bottom-24 left-4 right-4 h-16 bg-gradient-to-b from-[#FF0000]/20 to-transparent blur-[20px] opacity-40 transform scale-y-[-1]"></div>
      </div>
    </div>
  );
};