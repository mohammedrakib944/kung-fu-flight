import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Plane } from 'lucide-react';
import { SearchParams, Airport } from '../types/flight';
import { searchAirports } from '../services/amadeusApi';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  
  const [originResults, setOriginResults] = useState<Airport[]>([]);
  const [destResults, setDestResults] = useState<Airport[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  
  const [selectedOrigin, setSelectedOrigin] = useState<Airport | null>(null);
  const [selectedDest, setSelectedDest] = useState<Airport | null>(null);

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDepartureDate(today);
  }, []);

  // Search origin airports
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Don't search if the current origin matches the selected origin's display name
      const displayValue = selectedOrigin ? `${selectedOrigin.name} (${selectedOrigin.iataCode})` : '';
      
      if (origin.length >= 2 && origin !== displayValue) {
        const results = await searchAirports(origin);
        setOriginResults(results);
        setShowOriginDropdown(true);
      } else {
        setOriginResults([]);
        setShowOriginDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [origin, selectedOrigin]);

  // Search destination airports
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Don't search if the current destination matches the selected destination's display name
      const displayValue = selectedDest ? `${selectedDest.name} (${selectedDest.iataCode})` : '';

      if (destination.length >= 2 && destination !== displayValue) {
        const results = await searchAirports(destination);
        setDestResults(results);
        setShowDestDropdown(true);
      } else {
        setDestResults([]);
        setShowDestDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [destination, selectedDest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrigin || !selectedDest || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    const params: SearchParams = {
      originLocationCode: selectedOrigin.iataCode,
      destinationLocationCode: selectedDest.iataCode,
      departureDate,
      adults,
      max: 50,
    };

    if (tripType === 'roundtrip' && returnDate) {
      params.returnDate = returnDate;
    }

    onSearch(params);
  };

  const selectOrigin = (airport: Airport) => {
    setSelectedOrigin(airport);
    setOrigin(`${airport.name} (${airport.iataCode})`);
    setShowOriginDropdown(false);
  };

  const selectDestination = (airport: Airport) => {
    setSelectedDest(airport);
    setDestination(`${airport.name} (${airport.iataCode})`);
    setShowDestDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('roundtrip')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tripType === 'roundtrip'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tripType === 'oneway'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          One Way
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origin */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Plane className="inline w-4 h-4 mr-1" />
            From
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              setSelectedOrigin(null);
            }}
            placeholder="City or airport"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          {showOriginDropdown && originResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {originResults.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectOrigin(airport)}
                  className="w-full text-left px-4 py-3 hover:bg-primary-50 border-b last:border-b-0"
                >
                  <div className="font-medium">{airport.name}</div>
                  <div className="text-sm text-gray-600">
                    {airport.cityName}, {airport.countryName} ({airport.iataCode})
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Plane className="inline w-4 h-4 mr-1 rotate-90" />
            To
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setSelectedDest(null);
            }}
            placeholder="City or airport"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          {showDestDropdown && destResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {destResults.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectDestination(airport)}
                  className="w-full text-left px-4 py-3 hover:bg-primary-50 border-b last:border-b-0"
                >
                  <div className="font-medium">{airport.name}</div>
                  <div className="text-sm text-gray-600">
                    {airport.cityName}, {airport.countryName} ({airport.iataCode})
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Departure
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Return Date */}
        {tripType === 'roundtrip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Return
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Passengers
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Adult' : 'Adults'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {isLoading ? 'Searching...' : 'Search Flights'}
      </button>
    </form>
  );
};
