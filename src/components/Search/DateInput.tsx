import React from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  required?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  min,
  required
}) => {
  return (
    <div className="relative group">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all [color-scheme:dark]"
          required={required}
        />
      </div>
    </div>
  );
};
