import React from 'react';

interface Props {
  label: string;
  text: string | number;
  alert?: boolean;
}

export const Display: React.FC<Props> = ({ label, text, alert = false }) => {
  return (
    <div className="flex flex-col mb-8 group select-none">
      <div className="flex items-center gap-2 mb-2">
          {alert && <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-ping"></div>}
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.2em] group-hover:text-[#FF0000] transition-colors duration-500">
            {label}
          </span>
      </div>
      <div className={`
        font-sans font-black text-3xl tracking-[-0.05em] transition-all duration-300
        ${alert ? 'text-[#FF0000] drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]' : 'text-neutral-100'}
      `}>
        {text}
      </div>
      <div className="mt-1 h-[1px] w-full bg-gradient-to-r from-neutral-800 to-transparent group-hover:from-[#FF0000]/30 transition-all duration-500"></div>
    </div>
  );
};