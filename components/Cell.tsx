import React from 'react';
import { TetrominoType } from '../types';

interface Props {
  type: TetrominoType | 0;
  color: string;
}

export const Cell = React.memo(({ type, color }: Props) => {
  const isFilled = type !== 0;
  const isRed = color === 'red';

  return (
    <div className="w-full h-full relative overflow-hidden bg-black border-[0.5px] border-white/5">
      {isFilled && (
        <div
          className={`w-full h-full relative
            ${isRed
              ? 'bg-gradient-to-br from-[#FF0000] via-[#880000] to-[#220000]'
              : 'bg-gradient-to-br from-[#050505] via-[#000000] to-[#000000]'
            }
          `}
          style={{
            boxShadow: isRed
              ? 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 15px rgba(255, 0, 0, 0.4)'
              : 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 0 20px rgba(0,0,0,1)',
          }}
        >
          {/* 1. Primary Liquid Surface Highlight (Top-Down) */}
          <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>

          {/* 2. Sharp Vertical Polish Line */}
          <div className="absolute left-[15%] top-0 w-[1px] h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent blur-[0.5px] opacity-60"></div>

          {/* 3. Beveled Glass Edge */}
          <div className="absolute inset-0 border-[1px] border-t-white/30 border-l-white/15 border-r-black/80 border-b-black/90 pointer-events-none rounded-[1px]"></div>

          {/* 4. Dynamic Light Glint (Top Left) */}
          <div className="absolute top-[2px] left-[2px] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] pointer-events-none shadow-[0_0_4px_white] opacity-70"></div>
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