import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterState, FlightOffer } from '../types/flight';
import { getAllAirlines, getAirlineName } from '../utils/flightUtils';

interface FilterPanelProps {
  flights: FlightOffer[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  flights,
  filters,
  onFilterChange,
}) => {
  const airlines = getAllAirlines(flights);
  const maxPrice = Math.max(...flights.map((f) => parseFloat(f.price.total)));

  const handlePriceChange = (value: number) => {
    onFilterChange({ ...filters, maxPrice: value });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const handleStopsToggle = (stops: number) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter((s) => s !== stops)
      : [...filters.stops, stops];
    onFilterChange({ ...filters, stops: newStops });
  };

  const handleDepartureTimeChange = (time: string) => {
    onFilterChange({ ...filters, departureTime: time });
  };

  const clearFilters = () => {
    onFilterChange({
      maxPrice: maxPrice,
      airlines: [],
      stops: [],
      departureTime: 'all',
    });
  };

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.departureTime !== 'all' ||
    filters.maxPrice < maxPrice;

  return (
    <div className="glass-card rounded-3xl p-8 sticky top-8">
      <div className="flex items-center justify-between mb-8 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center border border-primary-500/20">
            <Filter className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">Refine</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-black text-primary-500 hover:text-primary-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Max Price
          </label>
          <span className="text-lg font-black text-primary-500 tracking-tighter">
            ${filters.maxPrice.toFixed(0)}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="10"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary-600 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">
          <span>$0</span>
          <span>${maxPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-10">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Stops</label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 0, label: 'Non-stop' },
            { value: 1, label: '1 Stop' },
            { value: 2, label: '2+ Stops' },
          ].map((option) => (
            <label key={option.value} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${filters.stops.includes(option.value) ? 'bg-primary-600/10 border-primary-600/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.stops.includes(option.value)}
                  onChange={() => handleStopsToggle(option.value)}
                  className="w-5 h-5 rounded-lg border-white/10 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
                />
              </div>
              <span className={`text-sm font-bold transition-colors ${filters.stops.includes(option.value) ? 'text-white' : 'text-gray-400'}`}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-10">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Departure
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'all', label: 'Any time' },
            { value: 'morning', label: 'Morning' },
            { value: 'afternoon', label: 'Afternoon' },
            { value: 'evening', label: 'Evening' },
            { value: 'night', label: 'Night' },
          ].map((option) => (
            <label key={option.value} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${filters.departureTime === option.value ? 'bg-primary-600/20 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
              <input
                type="radio"
                name="departureTime"
                checked={filters.departureTime === option.value}
                onChange={() => handleDepartureTimeChange(option.value)}
                className="w-4 h-4 border-white/20 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
              />
              <span className="text-xs font-black uppercase tracking-widest">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {airlines.length > 0 && (
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            Airlines
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {airlines.map((airline) => (
              <label key={airline} className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${filters.airlines.includes(airline) ? 'bg-primary-600/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 rounded border-white/10 bg-transparent text-primary-600 focus:ring-primary-600/50 transition-all cursor-pointer"
                />
                <span className="text-xs font-bold truncate">
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
