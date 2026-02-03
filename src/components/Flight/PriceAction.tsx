import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PriceActionProps {
  currency: string;
  total: string;
  onSelect?: () => void;
}

export const PriceAction: React.FC<PriceActionProps> = ({ currency, total, onSelect }) => {
  return (
    <div className="xl:w-80 xl:pl-10 xl:border-l border-white/5 flex flex-col justify-center items-center xl:items-end">
      <div className="mb-8 text-center xl:text-right">
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Total Price</div>
        <div className="flex items-baseline gap-2 justify-center xl:justify-end">
          <span className="text-2xl font-black text-primary-500 tracking-tighter">{currency}</span>
          <span className="text-6xl font-black text-white tracking-tighter">
            {Math.floor(parseFloat(total))}
            <span className="text-2xl text-white/30 font-medium">.{(parseFloat(total) % 1).toFixed(2).split('.')[1]}</span>
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            Lowest Price in 30 Days
          </div>
        </div>
      </div>
      
      <button 
        onClick={onSelect}
        className="w-full relative group/btn overflow-hidden rounded-2xl"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-accent-blue to-accent-purple rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:animate-pulse"></div>
        <div className="relative flex items-center justify-center gap-3 py-5 px-10 bg-white text-black font-black rounded-2xl transition-all duration-300 group-hover/btn:bg-primary-600 group-hover/btn:text-white group-hover/btn:shadow-2xl group-hover/btn:shadow-primary-600/40 translate-z-0">
          <span className="uppercase tracking-[0.2em] text-[10px]">Select Flight</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
        </div>
      </button>
    </div>
  );
};
