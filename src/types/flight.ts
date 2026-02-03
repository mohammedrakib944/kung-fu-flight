export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Itinerary[];
  validatingAirlineCodes: string[];
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Segment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
}

export interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

export interface FilterState {
  maxPrice: number;
  airlines: string[];
  stops: number[]; // 0 = non-stop, 1 = 1 stop, 2+ = 2+ stops
  departureTime: string; // 'morning', 'afternoon', 'evening', 'night', 'all'
}

export interface PriceDataPoint {
  price: number;
  count: number;
  range: string;
}

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}
