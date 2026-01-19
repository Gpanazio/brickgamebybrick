import React, { useEffect, useRef, useState } from 'react';

export const Monolith: React.FC = () => {
  const monolithRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!monolithRef.current) return;

      const rect = monolithRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Max distance to affect the monolith (e.g., 800px radius)
      const maxDist = 800;
      
      // Calculate normalized intensity (0 to 1), inverted so closer is higher
      const newIntensity = Math.max(0, 1 - distance / maxDist);
      
      setIntensity(newIntensity);
      
      // Update CSS variable for performance-friendly reactive styling in cells
      document.documentElement.style.setProperty('--intensity', newIntensity.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none">
      {/* The Monolith Container */}
      <div 
        ref={monolithRef}
        className="relative w-[300px] h-[500px] transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${1 + intensity * 0.05}) perspective(1000px) rotateX(${intensity * 2}deg)`,
        }}
      >
        {/* Concrete Texture Body */}
        <div className="absolute inset-0 bg-[#0a0a0a] border border-neutral-800 shadow-2xl overflow-hidden">
             {/* Subtile texture overlay */}
             <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
             
             {/* The Core Light */}
             <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-brick-red rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-breathe"
                style={{
                    boxShadow: `0 0 ${20 + intensity * 100}px rgba(220, 38, 38, ${0.4 + intensity * 0.6})`
                }}
             ></div>

             {/* Internal Scanlines */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brick-red/5 to-transparent h-[10px] w-full animate-scanline opacity-30"></div>
        </div>

        {/* Aura / Radiation */}
        <div 
            className="absolute inset-0 bg-brick-red blur-[100px] -z-10 transition-opacity duration-300"
            style={{ opacity: intensity * 0.3 }}
        ></div>
        
        {/* Reflection/Grounding */}
        <div className="absolute -bottom-20 left-10 right-10 h-10 bg-black blur-xl opacity-80"></div>
      </div>
    </div>
  );
};