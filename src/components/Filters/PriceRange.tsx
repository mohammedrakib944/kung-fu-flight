import React from "react";

interface PriceRangeProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  value,
  max,
  onChange,
}) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4">
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
          Max Price
        </label>
        <span className="text-lg font-semibold text-primary-500 tracking-tighter">
          ${value.toFixed(0)}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min="0"
          max={max}
          step="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary-600 focus:outline-none"
        />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-gray-500 mt-2 uppercase tracking-widest">
        <span>$0</span>
        <span>${max.toFixed(0)}</span>
      </div>
    </div>
  );
};
