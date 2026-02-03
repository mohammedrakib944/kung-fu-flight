import React, { useEffect, useMemo, useCallback } from "react";
import { PlaneTakeoff, Info } from "lucide-react";
import { SearchForm } from "./components/SearchForm";
import { FlightCard } from "./components/FlightCard";
import { FilterPanel } from "./components/FilterPanel";
import { PriceGraph } from "./components/PriceGraph";
import { SearchParams } from "./types/flight";
import { getPriceGroups } from "./utils/flightUtils";
import { useUrlState } from "./hooks/useUrlState";
import { useFlightSearch } from "./hooks/useFlightSearch";

const App: React.FC = () => {
  const {
    filteredFlights,
    isLoading,
    error,
    filters,
    setFilters,
    performSearch,
    flights,
  } = useFlightSearch();

  // URL State for Search and Filters
  const [urlState, setUrlState] = useUrlState({
    origin: "",
    dest: "",
    depDate: "",
    retDate: "",
    adults: 1,
    type: "roundtrip",
    maxPrice: 2000,
    airlines: [] as string[],
    stops: [] as number[],
    time: "all",
  });

  // Sync initial filters from URL
  useEffect(() => {
    setFilters({
      maxPrice: urlState.maxPrice,
      airlines: urlState.airlines,
      stops: urlState.stops,
      departureTime: urlState.time as any,
    });
  }, []);

  // Sync filters back to URL when they change
  useEffect(() => {
    setUrlState({
      maxPrice: filters.maxPrice,
      airlines: filters.airlines,
      stops: filters.stops,
      time: filters.departureTime,
    });
  }, [filters, setUrlState]);

  // Handle Search Execution
  const handleSearch = useCallback(
    (params: SearchParams) => {
      setUrlState({
        origin: params.originLocationCode,
        dest: params.destinationLocationCode,
        depDate: params.departureDate,
        retDate: params.returnDate || "",
        adults: params.adults,
        type: params.returnDate ? "roundtrip" : "oneway",
      });
      performSearch(params);
    },
    [performSearch, setUrlState],
  );

  // Initial load from URL
  useEffect(() => {
    if (urlState.origin && urlState.dest && urlState.depDate) {
      const params: SearchParams = {
        originLocationCode: urlState.origin,
        destinationLocationCode: urlState.dest,
        departureDate: urlState.depDate,
        adults: urlState.adults,
        max: 50,
      };
      if (urlState.type === "roundtrip" && urlState.retDate) {
        params.returnDate = urlState.retDate;
      }
      performSearch(params);
    }
  }, []); // Only on mount

  const priceGroups = useMemo(
    () => getPriceGroups(filteredFlights),
    [filteredFlights],
  );

  const airlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => set.add(f.validatingAirlineCodes[0]));
    return Array.from(set);
  }, [flights]);

  const maxPrice = useMemo(() => {
    if (flights.length === 0) return 2000;
    return Math.max(...flights.map((f) => parseFloat(f.price.total)));
  }, [flights]);

  return (
    <div className="min-h-screen bg-surface-50 text-white font-sans selection:bg-primary-500/30">
      {/* Background Mesh */}
      <div className="glow-mesh" aria-hidden="true" />

      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-surface-50/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-white/5 transition-all">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-blue rounded-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <PlaneTakeoff className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Kung-fu Flight
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {["Explore", "My Bookings", "Elite Club"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
            <button className="px-6 py-2.5 bg-white text-black text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5 hover:shadow-primary-500/20">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative">
        {/* Search Section */}
        <div className="relative mb-10">
          <div className="absolute -inset-4 bg-primary-600/5 blur-3xl rounded-[4rem]" />
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            initialValues={{
              origin: urlState.origin
                ? {
                    iataCode: urlState.origin,
                    name: urlState.origin,
                    cityName: "",
                    countryName: "",
                  }
                : null,
              destination: urlState.dest
                ? {
                    iataCode: urlState.dest,
                    name: urlState.dest,
                    cityName: "",
                    countryName: "",
                  }
                : null,
              departureDate: urlState.depDate,
              returnDate: urlState.retDate,
              adults: urlState.adults,
              tripType: urlState.type as any,
            }}
          />
        </div>

        {error && (
          <div className="glass-card border-red-500/20 bg-red-500/5 p-8 rounded-3xl mb-12 flex items-center gap-6 animate-float">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
              <Info className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                System Notice
              </h3>
              <p className="text-red-400/80 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          {flights.length > 0 && (
            <div className="lg:col-span-1 space-y-8">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                maxPrice={maxPrice}
                airlines={airlines}
              />
            </div>
          )}

          {/* Results Area */}
          <div
            className={flights.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                  <PlaneTakeoff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">
                  Analyzing Routes...
                </h3>
                <p className="text-gray-500 uppercase text-[10px] font-semibold tracking-[0.3em]">
                  Searching 500+ Luxury Airlines
                </p>
              </div>
            ) : flights.length > 0 ? (
              <div className="space-y-12">
                <section className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
                  <PriceGraph data={priceGroups} />
                </section>

                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-2xl font-semibold tracking-tighter">
                      Available{" "}
                      <span className="text-primary-500">Curated</span> Options
                    </h3>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
                      {filteredFlights.length} Voyages Found
                    </div>
                  </div>
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                  {filteredFlights.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-3xl border-dashed border-white/10">
                      <p className="text-gray-500 font-medium">
                        No flights match your elite criteria.
                      </p>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            maxPrice: 2000,
                            airlines: [],
                            stops: [],
                            departureTime: "all",
                          })
                        }
                        className="mt-4 text-primary-500 font-semibold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !error && (
                <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border border-dashed border-white/5 bg-white/2">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8">
                    <PlaneTakeoff className="w-10 h-10 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Begin Your Journey
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Select your origin and destination to discover exclusive
                    routes.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
