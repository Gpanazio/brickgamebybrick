import React from 'react';
import { TetrominoType } from '../types';

interface Props {
  type: TetrominoType | 0;
  color: string;
}

export const Cell = React.memo(({ type, color }: Props) => {
  const isFilled = type !== 0;
  const isRed = color === 'red';

  // Base colors requested: Pure Red (#FF0000) and Pure Black (#000000)
  // We use color-mix to transition between a "system-dim" state and the "activated" pure color based on Monolith intensity.
  const reactiveStyle = {
    backgroundColor: isRed 
      ? `color-mix(in srgb, #450000, #FF0000 calc(var(--intensity) * 100%))` 
      : `color-mix(in srgb, #050505, #000000 calc(var(--intensity) * 100%))`,
    boxShadow: isRed 
      ? `inset 0 0 15px rgba(0,0,0,0.7), 0 0 calc(5px + var(--intensity) * 30px) rgba(255, 0, 0, calc(0.2 + var(--intensity) * 0.6))`
      : `inset 0 0 10px rgba(255,255,255,0.05), 0 0 calc(2px + var(--intensity) * 15px) rgba(0, 0, 0, 1)`,
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black/80 border-[0.5px] border-white/5 transition-colors duration-700">
      {isFilled && (
        <div 
          className={`w-full h-full transition-all duration-300 relative
            ${isRed 
              ? 'bg-gradient-to-br from-[#FF0000] via-[#990000] to-[#440000]' 
              : 'bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000]'
            }
          `}
          style={reactiveStyle}
        >
          {/* 1. Deep Volumetric Refraction - Creates the "Liquid" look inside */}
          <div 
            className={`absolute inset-[10%] rounded-[4px] blur-[10px] opacity-30`}
            style={{
              backgroundColor: isRed ? '#FF0000' : '#444444',
              transform: `scale(calc(0.8 + var(--intensity) * 0.4))`,
            }}
          ></div>

          {/* 2. Micro-Diamond Texture Layer */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          {/* 3. Primary Liquid Surface Highlight (Top-Down) */}
          <div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none"
            style={{
              opacity: `calc(0.5 + var(--intensity) * 0.5)`,
              transform: `translateY(calc(var(--intensity) * -5%))`
            }}
          ></div>

          {/* 4. Sharp Vertical Polish Line (The "Elegance" factor) */}
          <div 
            className="absolute left-[15%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent blur-[0.5px]"
            style={{
              transform: `translateX(calc(var(--intensity) * 10px))`
            }}
          ></div>

          {/* 5. Beveled Glass Edge - Sharp internal border */}
          <div className="absolute inset-0 border-[1px] border-t-white/50 border-l-white/20 border-r-black/60 border-b-black/90 pointer-events-none"></div>
          
          {/* 6. Dynamic Light Glint (Top Left) */}
          <div className="absolute top-1 left-1 w-2 h-1 bg-white/60 rounded-full blur-[1px] rotate-[-45deg] pointer-events-none"></div>

          {/* 7. Bottom Contact Depth */}
          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>

          {/* 8. Inner Pulsing Core - Reacts heavily to intensity */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full blur-[6px] pointer-events-none`}
            style={{
              backgroundColor: isRed ? '#FF3333' : '#FFFFFF',
              opacity: `calc(0.1 + var(--intensity) * 0.9)`,
              transform: `translate(-50%, -50%) scale(calc(1 + var(--intensity) * 4))`
            }}
          ></div>
        </div>
      )}
      
      {!isFilled && (
         <div className="w-full h-full flex items-center justify-center opacity-5">
            <div className="w-[1.5px] h-[1.5px] bg-white/40 rounded-full"></div>
         </div>
      )}
    </div>
  );
});