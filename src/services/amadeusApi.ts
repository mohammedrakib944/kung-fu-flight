import { SearchParams, FlightOffer, Airport } from '../types/flight';

const API_KEY = 'aA63ALkAKAywJGjT6a11D6ipP4lT2AWA';
const API_SECRET = '2HscKeoXaBGCeFZZ';
const BASE_URL = 'https://test.api.amadeus.com/v1';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// Get OAuth token
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(`${BASE_URL}/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: API_KEY,
      client_secret: API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Amadeus API');
  }

  const data = await response.json();
  accessToken = data.access_token;
  // Set expiry to 5 minutes before actual expiry for safety
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  
  return accessToken as string;
}

// Search for airports by keyword
export async function searchAirports(keyword: string): Promise<Airport[]> {
  if (keyword.length < 2) return [];

  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({
      keyword,
      subType: 'AIRPORT,CITY',
      'page[limit]': '20',
    });

    const response = await fetch(
      `${BASE_URL}/reference-data/locations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Airport search failed:', response.status);
      return [];
    }

    const data = await response.json();
    return data.data.map((location: any) => ({
      iataCode: location.iataCode,
      name: location.name,
      cityName: location.address?.cityName || '',
      countryName: location.address?.countryName || '',
    }));
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
}

// Search for flight offers
export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  try {
    const token = await getAccessToken();
    
    const searchParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: (params.max || 50).toString(),
    });

    if (params.returnDate) {
      searchParams.append('returnDate', params.returnDate);
    }
    
    if (params.children) {
      searchParams.append('children', params.children.toString());
    }
    
    if (params.infants) {
      searchParams.append('infants', params.infants.toString());
    }
    
    if (params.travelClass) {
      searchParams.append('travelClass', params.travelClass);
    }
    
    if (params.nonStop) {
      searchParams.append('nonStop', 'true');
    }
    
    if (params.currencyCode) {
      searchParams.append('currencyCode', params.currencyCode);
    }

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Flight search failed:', response.status, errorData);
      throw new Error(`Failed to search flights: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}
