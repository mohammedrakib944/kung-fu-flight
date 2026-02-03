import React, { useState, useEffect } from "react";
import { Plane } from "lucide-react";
import { Airport } from "../../types/flight";
import { searchAirports } from "../../services/amadeusApi";

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  iconRotate?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  iconRotate,
}) => {
  const [inputValue, setInputValue] = useState(
    value ? `${value.name} (${value.iataCode})` : "",
  );
  const [results, setResults] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value) {
      setInputValue(`${value.name} (${value.iataCode})`);
    } else {
      // If value is null, keep inputValue if user is typing, or clear if it was a direct reset
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const displayValue = value ? `${value.name} (${value.iataCode})` : "";
      if (inputValue.length >= 2 && inputValue !== displayValue) {
        const results = await searchAirports(inputValue);
        setResults(results);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, value]);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setInputValue(`${airport.name} (${airport.iataCode})`);
    setShowDropdown(false);
  };

  return (
    <div className="relative group">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <Plane
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors ${iconRotate ? "rotate-90" : ""}`}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (value) onChange(null);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50 transition-all outline-none"
          required
        />
      </div>
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#171c24] z-10 rounded-2xl overflow-y-auto max-h-[350px] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((airport) => (
            <button
              key={airport.iataCode}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full text-left px-5 py-4 hover:bg-primary-600/20 transition-colors group/item"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white group-hover/item:text-primary-400 transition-colors">
                    {airport.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {airport.cityName}, {airport.countryName}
                  </div>
                </div>
                <div className="text-xs font-semibold bg-white/5 px-2 py-1 rounded text-primary-500">
                  {airport.iataCode}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
