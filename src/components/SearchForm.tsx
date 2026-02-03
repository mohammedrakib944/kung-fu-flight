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
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl opacity-50"></div>
      
      <div className="flex gap-2 mb-8 p-1 bg-white/5 w-fit rounded-2xl border border-white/5">
        <button
          type="button"
          onClick={() => setTripType('roundtrip')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            tripType === 'roundtrip'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            tripType === 'oneway'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          One Way
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Origin */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Origin
          </label>
          <div className="relative">
            <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setSelectedOrigin(null);
              }}
              placeholder="City or airport"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50 transition-all outline-none"
              required
            />
          </div>
          {showOriginDropdown && originResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {originResults.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectOrigin(airport)}
                  className="w-full text-left px-5 py-4 hover:bg-primary-600/20 transition-colors group/item"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white group-hover/item:text-primary-400 transition-colors">{airport.name}</div>
                      <div className="text-sm text-gray-400">
                        {airport.cityName}, {airport.countryName}
                      </div>
                    </div>
                    <div className="text-xs font-black bg-white/5 px-2 py-1 rounded text-primary-500">{airport.iataCode}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Destination
          </label>
          <div className="relative">
            <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 rotate-90 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSelectedDest(null);
              }}
              placeholder="Where to?"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50 transition-all outline-none"
              required
            />
          </div>
          {showDestDropdown && destResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {destResults.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectDestination(airport)}
                  className="w-full text-left px-5 py-4 hover:bg-primary-600/20 transition-colors group/item"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white group-hover/item:text-primary-400 transition-colors">{airport.name}</div>
                      <div className="text-sm text-gray-400">
                        {airport.cityName}, {airport.countryName}
                      </div>
                    </div>
                    <div className="text-xs font-black bg-white/5 px-2 py-1 rounded text-primary-500">{airport.iataCode}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Departure
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all [color-scheme:dark]"
              required
            />
          </div>
        </div>

        {/* Return Date / Passengers */}
        <div className="flex gap-4">
          {tripType === 'roundtrip' ? (
            <div className="flex-1 relative group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Return
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 relative group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Travelers
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-surface-100">
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {tripType === 'roundtrip' && (
            <div className="w-24 relative group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Qty
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-surface-100">
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/5 pt-8">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary-600 focus:ring-primary-600/50 transition-all" />
            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors">Non-stop only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary-600 focus:ring-primary-600/50 transition-all" />
            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors">Refundable</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[200px] relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-blue rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="uppercase tracking-widest text-xs">Search Skybound</span>
          </div>
        </button>
      </div>
    </form>
  );
};
