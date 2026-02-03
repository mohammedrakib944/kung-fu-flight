import React from "react";
import { Filter, X } from "lucide-react";
import { FilterState } from "../types/flight";
import { getAirlineName } from "../utils/flightUtils";
import { PriceRange } from "./Filters/PriceRange";
import { StopsFilter } from "./Filters/StopsFilter";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxPrice: number;
  airlines: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  maxPrice,
  airlines,
}) => {
  const handlePriceChange = (maxPrice: number) => {
    onFilterChange({ ...filters, maxPrice });
  };

  const handleStopsToggle = (stops: number) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter((s) => s !== stops)
      : [...filters.stops, stops];
    onFilterChange({ ...filters, stops: newStops });
  };

  const handleDepartureTimeChange = (departureTime: string) => {
    onFilterChange({ ...filters, departureTime });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const clearFilters = () => {
    onFilterChange({
      maxPrice,
      airlines: [],
      stops: [],
      departureTime: "all",
    });
  };

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.departureTime !== "all" ||
    filters.maxPrice < maxPrice;

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center border border-primary-500/20">
            <Filter className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Refine
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-primary-500 hover:text-primary-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <PriceRange
        value={filters.maxPrice}
        max={maxPrice}
        onChange={handlePriceChange}
      />

      <StopsFilter selectedStops={filters.stops} onChange={handleStopsToggle} />

      {/* Departure Time */}
      <div className="mb-10">
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4">
          Departure
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: "all", label: "Any time" },
            { value: "morning", label: "Morning" },
            { value: "afternoon", label: "Afternoon" },
            { value: "evening", label: "Evening" },
            { value: "night", label: "Night" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${filters.departureTime === option.value ? "bg-primary-600/20 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}
            >
              <input
                type="radio"
                name="departureTime"
                checked={filters.departureTime === option.value}
                onChange={() => handleDepartureTimeChange(option.value)}
                className="w-4 h-4 border-white/20 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
              />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {airlines.length > 0 && (
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4">
            Airlines
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {airlines.map((airline) => (
              <label
                key={airline}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${filters.airlines.includes(airline) ? "bg-primary-600/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
              >
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 rounded border-white/10 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
                />
                <span className="text-xs font-medium truncate">
                  {getAirlineName(airline)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
