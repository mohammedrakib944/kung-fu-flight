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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Maximum Price
        </label>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="10"
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>$0</span>
          <span className="font-semibold text-primary-600">
            ${filters.maxPrice.toFixed(0)}
          </span>
          <span>${maxPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Stops</label>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Non-stop' },
            { value: 1, label: '1 Stop' },
            { value: 2, label: '2+ Stops' },
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={() => handleStopsToggle(option.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Departure Time
        </label>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Any time' },
            { value: 'morning', label: 'Morning (5:00 - 11:59)' },
            { value: 'afternoon', label: 'Afternoon (12:00 - 16:59)' },
            { value: 'evening', label: 'Evening (17:00 - 20:59)' },
            { value: 'night', label: 'Night (21:00 - 4:59)' },
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="departureTime"
                checked={filters.departureTime === option.value}
                onChange={() => handleDepartureTimeChange(option.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {airlines.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Airlines
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {airlines.map((airline) => (
              <label key={airline} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {getAirlineName(airline)} ({airline})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
