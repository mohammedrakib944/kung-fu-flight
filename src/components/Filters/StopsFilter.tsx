import React from "react";

interface StopsFilterProps {
  selectedStops: number[];
  onChange: (stops: number) => void;
}

export const StopsFilter: React.FC<StopsFilterProps> = ({
  selectedStops,
  onChange,
}) => {
  const options = [
    { value: 0, label: "Non-stop" },
    { value: 1, label: "1 Stop" },
    { value: 2, label: "2+ Stops" },
  ];

  return (
    <div className="mb-10">
      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4">
        Stops
      </label>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedStops.includes(option.value)
                ? "bg-primary-600/10 border-primary-600/30 text-white"
                : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-400"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedStops.includes(option.value)}
              onChange={() => onChange(option.value)}
              className="w-5 h-5 rounded-lg border-white/10 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
