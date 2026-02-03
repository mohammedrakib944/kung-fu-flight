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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Flight Search Engine</h1>
              <p className="text-sm text-gray-600">Find the best flights at the best prices</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Searching for flights...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && flights.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters - Left Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                flights={flights}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>

            {/* Main Content - Right Side */}
            <div className="lg:col-span-3 space-y-6">
              {/* Price Graph */}
              <PriceGraph data={priceData} />

              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredFlights.length} {filteredFlights.length === 1 ? 'Flight' : 'Flights'} Found
                  </h2>
                  <div className="text-sm text-gray-600">
                    {filteredFlights.length !== flights.length && (
                      <span>Filtered from {flights.length} total flights</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Flight List */}
              {filteredFlights.length > 0 ? (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No flights match your filters
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasSearched && (
          <div className="text-center py-16">
            <Plane className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to explore the world?
            </h2>
            <p className="text-gray-600">
              Enter your travel details above to find the best flights
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Powered by Amadeus API • Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
