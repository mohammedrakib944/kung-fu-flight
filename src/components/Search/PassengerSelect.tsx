import React from "react";
import { Users } from "lucide-react";

interface PassengerSelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  showLabelQty?: boolean;
}

export const PassengerSelect: React.FC<PassengerSelectProps> = ({
  label,
  value,
  onChange,
  className = "",
  showLabelQty = false,
}) => {
  return (
    <div className={`relative group ${className}`}>
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all appearance-none"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num} className="bg-[#1a1d23]">
              {showLabelQty ? num : `${num} ${num === 1 ? "Adult" : "Adults"}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
