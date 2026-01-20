import React, { useEffect, useRef } from 'react';

export const Monolith: React.FC = () => {
  const monolithRef = useRef<HTMLDivElement>(null);

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

      // Update CSS variable for performance-friendly reactive styling in cells
      // This drives the entire animation system without React re-renders
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
          transform: `scale(calc(1 + var(--intensity, 0) * 0.05)) perspective(1000px) rotateX(calc(var(--intensity, 0) * 2deg))`,
        }}
      >
        {/* Obsidian/Liquid Glass Body */}
        <div className="absolute inset-0 bg-black border border-white/10 shadow-2xl overflow-hidden rounded-sm backdrop-blur-sm">

          {/* Deep Volumetric Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-black to-[#050505] opacity-90"></div>

          {/* Subtile geometric texture overlay - Tech/Carbon feel */}
          <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-screen"></div>

          {/* The Core Light - Volumetric Pulse */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF0000] rounded-full blur-[2px] animate-breathe transition-all duration-1000 ease-in-out"
            style={{
              boxShadow: `
                      0 0 calc(40px + var(--intensity, 0) * 60px) rgba(220, 38, 38, calc(0.5 + var(--intensity, 0) * 0.5)),
                      inset 0 0 20px rgba(255, 200, 200, 0.5)
                    `
            }}
          ></div>

          {/* Liquid Glass Reflections */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
            style={{ opacity: `calc(0.3 + var(--intensity, 0) * 0.2)` }}
          ></div>

          {/* Internal Scanlines - Finer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40"></div>

          {/* Vertical Polish Line */}
          <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-50"></div>
        </div>

        {/* Aura / Radiation - Boosted intensity per user request */}
        <div
          className="absolute inset-0 bg-[#FF0000] blur-[120px] -z-10 transition-opacity duration-300 animate-breathe"
          style={{ opacity: `calc(0.3 + var(--intensity, 0) * 0.5)` }}
        ></div>

        {/* Ground Reflection - Sharp wet look */}
        <div className="absolute -bottom-24 left-4 right-4 h-16 bg-gradient-to-b from-[#FF0000]/20 to-transparent blur-[20px] opacity-40 transform scale-y-[-1] mask-image-linear-to-b"></div>
      </div>
    </div>
  );
};