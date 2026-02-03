import React, { useState, useEffect } from 'react';
import { Plane, AlertCircle } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { FlightCard } from './components/FlightCard';
import { PriceGraph } from './components/PriceGraph';
import { FilterPanel } from './components/FilterPanel';
import { FlightOffer, SearchParams, FilterState } from './types/flight';
import { searchFlights } from './services/amadeusApi';
import {
  filterFlights,
  generatePriceData,
} from './utils/flightUtils';

function App() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    maxPrice: Infinity,
    airlines: [],
    stops: [],
    departureTime: 'all',
  });

  // Update filtered flights whenever flights or filters change
  useEffect(() => {
    if (flights.length > 0) {
      const filtered = filterFlights(flights, filters);
      setFilteredFlights(filtered);
    }
  }, [flights, filters]);

  // Initialize max price filter when flights are loaded
  useEffect(() => {
    if (flights.length > 0) {
      const maxPrice = Math.max(...flights.map((f) => parseFloat(f.price.total)));
      setFilters((prev) => ({ ...prev, maxPrice }));
    }
  }, [flights]);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const results = await searchFlights(params);
      setFlights(results);
      
      if (results.length === 0) {
        setError('No flights found for your search criteria. Try different dates or destinations.');
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to search flights. Please try again.'
      );
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const priceData = generatePriceData(filteredFlights);

  return (
    <div className="min-h-screen">
      <div className="glow-mesh" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-blue rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center border border-white/10">
                <Plane className="w-7 h-7 text-primary-400 animate-float" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Sky<span className="text-primary-500">Bound</span>
              </h1>
              <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                Premium Flight Experience
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Search Form */}
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12 glass-card rounded-2xl p-6 flex items-start gap-4 border-red-500/20">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Search Alert</h3>
              <p className="text-gray-400 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-500 animate-pulse" />
            </div>
            <p className="text-gray-400 font-bold mt-8 tracking-widest uppercase text-xs">Finding matches...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && flights.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters - Left Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                flights={flights}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>

            {/* Main Content - Right Side */}
            <div className="lg:col-span-3 space-y-8">
              {/* Price Graph */}
              <div className="glass-card rounded-2xl p-6">
                <PriceGraph data={priceData} />
              </div>

              {/* Results Header */}
              <div className="glass-card rounded-2xl p-5 flex items-center justify-between border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    {filteredFlights.length} {filteredFlights.length === 1 ? 'Destination' : 'Destinations'} found
                  </h2>
                </div>
                <div className="text-sm font-medium text-gray-400 px-3 py-1 bg-white/5 rounded-full">
                  {filteredFlights.length !== flights.length ? (
                    <span>Refined from {flights.length}</span>
                  ) : (
                    <span>Best prices found</span>
                  )}
                </div>
              </div>

              {/* Flight List */}
              {filteredFlights.length > 0 ? (
                <div className="space-y-6">
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-16 text-center border-dashed border-2 border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No matching flights
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Try loosening your filters or changing your travel dates to see more options.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasSearched && (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-primary-500/10 blur-2xl rounded-full"></div>
              <Plane className="w-32 h-32 text-white/10 relative" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              Ready for takeoff?
            </h2>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              Explore thousands of routes at the most competitive prices in the world.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-50">
              <Plane className="w-5 h-5" />
              <span className="font-bold tracking-tight">SkyBound</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              © 2026 Flight Search Engine. Powered by Amadeus Elite API.
            </p>
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
              <a href="#" className="hover:text-primary-400 transition">Support</a>
              <a href="#" className="hover:text-primary-400 transition">Privacy</a>
              <a href="#" className="hover:text-primary-400 transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
