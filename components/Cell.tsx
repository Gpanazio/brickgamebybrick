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
      : `rgb(0,0,0)`, // Pure darkest black base
    boxShadow: isRed
      ? `inset 0 0 20px rgba(0,0,0,0.8), 0 0 calc(5px + var(--intensity) * 30px) rgba(255, 0, 0, calc(0.2 + var(--intensity) * 0.6))`
      : `inset 0 1px 1px rgba(255,255,255,0.15), inset 0 0 20px rgba(0,0,0,1), 0 0 calc(2px + var(--intensity) * 15px) rgba(0, 0, 0, 0.8)`, // Sharper top edge, deeper inner void
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black border-[0.5px] border-white/5 transition-colors duration-700">
      {isFilled && (
        <div
          className={`w-full h-full transition-all duration-300 relative
            ${isRed
              ? 'bg-gradient-to-br from-[#FF0000] via-[#880000] to-[#220000]'
              : 'bg-gradient-to-br from-[#050505] via-[#000000] to-[#000000]' /* Pure black mostly */
            }
          `}
          style={reactiveStyle}
        >
          {/* 1. Deep Volumetric Refraction - Creates the "Liquid" look inside */}
          <div
            className={`absolute inset-[10%] rounded-[4px] blur-[8px] opacity-40`}
            style={{
              backgroundColor: isRed ? '#FF0000' : '#000000', // Changed to black for black pieces
              transform: `scale(calc(0.8 + var(--intensity) * 0.4))`,
            }}
          ></div>

          {/* 2. Micro-Texture Layer - Reduced opacity for cleaner glass look */}
          <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          {/* 3. Primary Liquid Surface Highlight (Top-Down) - Dynamic sheen */}
          <div
            className="absolute top-0 left-0 w-full h-[70%] bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none mix-blend-overlay" // Reduced opacity to prevent graying
            style={{
              opacity: `calc(0.05 + var(--intensity) * 0.4)`, // Reduced intensity influence on opacity
              transform: `
                translateY(calc(var(--intensity) * -15%)) 
                scaleY(calc(1 + var(--intensity) * 0.15)) 
                skewX(calc(var(--intensity) * -8deg))
              ` // Light bending / wave effect
            }}
          ></div>

          {/* 4. Sharp Vertical Polish Line (The "Elegance" factor) */}
          <div
            className="absolute left-[15%] top-0 w-[1px] h-full bg-gradient-to-b from-white/60 via-white/10 to-transparent blur-[0.5px]"
            style={{
              opacity: `calc(0.1 + var(--intensity) * 0.9)`,
              transform: `translateX(calc(var(--intensity) * 15px)) skewX(calc(var(--intensity) * 15deg))`
            }}
          ></div>

          {/* 5. Beveled Glass Edge - Sharp internal border - Enhanced */}
          <div className="absolute inset-0 border-[1px] border-t-white/40 border-l-white/20 border-r-black/80 border-b-black/90 pointer-events-none rounded-[1px]"></div>

          {/* 6. Dynamic Light Glint (Top Left) - Brighter */}
          <div className="absolute top-[2px] left-[2px] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] pointer-events-none shadow-[0_0_5px_white] opacity-80"></div>

          {/* 7. Bottom Contact Depth - Stronger shadow for 3D effect */}
          <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none"></div>

          {/* 8. Inner Pulsing Core - Reacts heavily to intensity */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full blur-[5px] pointer-events-none`}
            style={{
              backgroundColor: isRed ? '#FF5555' : '#333333', // Dark gray/shiny black core instead of white
              opacity: `calc(0.2 + var(--intensity) * 0.8)`,
              transform: `translate(-50%, -50%) scale(calc(1 + var(--intensity) * 4))`
            }}
          ></div>
        </div>
      )}

      {!isFilled && (
        <div className="w-full h-full flex items-center justify-center opacity-[0.03]">
          <div className="w-[1px] h-[1px] bg-white text-[1px]"></div>
        </div>
      )}
    </div>
  );
});