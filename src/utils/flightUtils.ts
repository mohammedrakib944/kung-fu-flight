import { FlightOffer, PriceDataPoint, FilterState } from '../types/flight';
import { format } from 'date-fns';

export function formatDuration(duration: string): string {
  // Duration format: PT10H30M
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    return format(date, 'HH:mm');
  } catch {
    return dateTimeString;
  }
}

export function formatDate(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    return format(date, 'MMM dd');
  } catch {
    return dateTimeString;
  }
}

export function getNumberOfStops(flight: FlightOffer): number {
  // Get the maximum number of stops from all itineraries
  return Math.max(
    ...flight.itineraries.map((itinerary) => itinerary.segments.length - 1)
  );
}

export function getAirlines(flight: FlightOffer): string[] {
  const airlines = new Set<string>();
  flight.itineraries.forEach((itinerary) => {
    itinerary.segments.forEach((segment) => {
      airlines.add(segment.carrierCode);
    });
  });
  return Array.from(airlines);
}

export function getDepartureTimeCategory(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  } catch {
    return 'all';
  }
}

export function filterFlights(
  flights: FlightOffer[],
  filters: FilterState
): FlightOffer[] {
  return flights.filter((flight) => {
    // Price filter
    const price = parseFloat(flight.price.total);
    if (price > filters.maxPrice) return false;

    // Airline filter
    if (filters.airlines.length > 0) {
      const flightAirlines = getAirlines(flight);
      const hasMatchingAirline = flightAirlines.some((airline) =>
        filters.airlines.includes(airline)
      );
      if (!hasMatchingAirline) return false;
    }

    // Stops filter
    if (filters.stops.length > 0) {
      const stops = getNumberOfStops(flight);
      const matchesStops = filters.stops.some((filterStop) => {
        if (filterStop === 0) return stops === 0;
        if (filterStop === 1) return stops === 1;
        return stops >= 2; // 2+ stops
      });
      if (!matchesStops) return false;
    }

    // Departure time filter
    if (filters.departureTime !== 'all') {
      const departureTime = getDepartureTimeCategory(
        flight.itineraries[0].segments[0].departure.at
      );
      if (departureTime !== filters.departureTime) return false;
    }

    return true;
  });
}

export function getPriceGroups(flights: FlightOffer[]): PriceDataPoint[] {
  if (flights.length === 0) return [];

  // Group flights by price ranges
  const prices = flights.map((f) => parseFloat(f.price.total));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const bucketSize = range / 10 || 1;

  const buckets: { [key: string]: number } = {};

  flights.forEach((flight) => {
    const price = parseFloat(flight.price.total);
    const bucketIndex = Math.floor((price - minPrice) / bucketSize);
    const bucketStart = minPrice + bucketIndex * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const key = `$${Math.round(bucketStart)}-$${Math.round(bucketEnd)}`;

    buckets[key] = (buckets[key] || 0) + 1;
  });

  return Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
    price: parseFloat(range.split('-')[0].replace('$', '')),
  })).sort((a, b) => a.price - b.price);
}

export function getAllAirlines(flights: FlightOffer[]): string[] {
  const airlines = new Set<string>();
  flights.forEach((flight) => {
    getAirlines(flight).forEach((airline) => airlines.add(airline));
  });
  return Array.from(airlines).sort();
}

export function getAirlineName(code: string): string {
  // Common airline codes - in production, use a complete mapping
  const airlineNames: { [key: string]: string } = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'TK': 'Turkish Airlines',
    'EY': 'Etihad Airways',
    'QF': 'Qantas',
    'AC': 'Air Canada',
    'NH': 'All Nippon Airways',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'IB': 'Iberia',
    'AZ': 'Alitalia',
    'VS': 'Virgin Atlantic',
  };

  return airlineNames[code] || code;
}
