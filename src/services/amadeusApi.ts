import { SearchParams, FlightOffer, Airport } from "../types/flight";

const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const API_BASE_URL = import.meta.env.VITE_AMADEUS_API_BASE_URL;

class AmadeusService {
  private static instance: AmadeusService;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  public static getInstance(): AmadeusService {
    if (!AmadeusService.instance) {
      AmadeusService.instance = new AmadeusService();
    }
    return AmadeusService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/security/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: API_KEY,
          client_secret: API_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with Amadeus API");
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.accessToken as string;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const token = await this.getAccessToken();

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token might be expired, clear it and retry once
        this.accessToken = null;
        this.tokenExpiry = null;
        const newToken = await this.getAccessToken();
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: newHeaders,
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(
            `API Request failed after retry: ${retryResponse.status} ${JSON.stringify(errorData)}`,
          );
        }
        return retryResponse.json();
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Request failed:", response.status, errorData);
        throw new Error(`API Request failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error requesting ${endpoint}:`, error);
      throw error;
    }
  }

  public async searchAirports(keyword: string): Promise<Airport[]> {
    if (keyword.length < 2) return [];

    try {
      const params = new URLSearchParams({
        keyword,
        subType: "AIRPORT,CITY",
        "page[limit]": "20",
      });

      const data: any = await this.request(
        `/v1/reference-data/locations?${params}`,
      );

      return data.data.map((location: any) => ({
        iataCode: location.iataCode,
        name: location.name,
        cityName: location.address?.cityName || "",
        countryName: location.address?.countryName || "",
      }));
    } catch (error) {
      console.error("Error searching airports:", error);
      return [];
    }
  }

  public async searchFlights(params: SearchParams): Promise<FlightOffer[]> {
    try {
      const searchParams = new URLSearchParams({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        max: (params.max || 50).toString(),
      });

      if (params.returnDate) {
        searchParams.append("returnDate", params.returnDate);
      }

      if (params.children) {
        searchParams.append("children", params.children.toString());
      }

      if (params.infants) {
        searchParams.append("infants", params.infants.toString());
      }

      if (params.travelClass) {
        searchParams.append("travelClass", params.travelClass);
      }

      if (params.nonStop) {
        searchParams.append("nonStop", "true");
      }

      if (params.currencyCode) {
        searchParams.append("currencyCode", params.currencyCode);
      }

      const data: any = await this.request(
        `/v2/shopping/flight-offers?${searchParams}`,
      );
      return data.data || [];
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  }
}

export const amadeusService = AmadeusService.getInstance();
