import { useState, useCallback, useMemo } from "react";
import { FlightOffer, SearchParams, FilterState } from "../types/flight";
import { searchFlights } from "../services/amadeusApi";

const INITIAL_FILTERS: FilterState = {
  maxPrice: 2000,
  airlines: [],
  stops: [],
  departureTime: "all",
};

export function useFlightSearch() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const performSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchFlights(params);
      setFlights(results);

      // Update initial max price based on results
      if (results.length > 0) {
        const prices = results.map((f: FlightOffer) =>
          parseFloat(f.price.total),
        );
        const maxPrice = Math.max(...prices);
        setFilters((prev) => ({ ...prev, maxPrice }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch flights");
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const price = parseFloat(flight.price.total);
      if (price > filters.maxPrice) return false;

      if (filters.airlines.length > 0) {
        const airline = flight.validatingAirlineCodes[0];
        if (!filters.airlines.includes(airline)) return false;
      }

      const stops = flight.itineraries[0].segments.length - 1;
      if (filters.stops.length > 0) {
        if (filters.stops.includes(2)) {
          if (stops < 2 && !filters.stops.includes(stops)) return false;
        } else if (!filters.stops.includes(stops)) {
          return false;
        }
      }

      if (filters.departureTime !== "all") {
        const departureAt = new Date(
          flight.itineraries[0].segments[0].departure.at,
        );
        const hour = departureAt.getHours();

        if (filters.departureTime === "morning" && (hour < 5 || hour >= 12))
          return false;
        if (filters.departureTime === "afternoon" && (hour < 12 || hour >= 17))
          return false;
        if (filters.departureTime === "evening" && (hour < 17 || hour >= 21))
          return false;
        if (filters.departureTime === "night" && hour >= 5 && hour < 21)
          return false;
      }

      return true;
    });
  }, [flights, filters]);

  return {
    flights,
    filteredFlights,
    isLoading,
    error,
    filters,
    setFilters,
    performSearch,
    INITIAL_FILTERS,
  };
}
