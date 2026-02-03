import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchParams, Airport } from "../types/flight";
import { LocationInput } from "./Search/LocationInput";
import { DateInput } from "./Search/DateInput";
import { PassengerSelect } from "./Search/PassengerSelect";
import { TripTypeToggle } from "./Search/TripTypeToggle";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  initialValues?: {
    origin?: Airport | null;
    destination?: Airport | null;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
    tripType?: "roundtrip" | "oneway";
  };
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  initialValues,
}) => {
  const [origin, setOrigin] = useState<Airport | null>(
    initialValues?.origin || null,
  );
  const [destination, setDestination] = useState<Airport | null>(
    initialValues?.destination || null,
  );
  const [departureDate, setDepartureDate] = useState(
    initialValues?.departureDate || "",
  );
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || "");
  const [adults, setAdults] = useState(initialValues?.adults || 1);
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">(
    initialValues?.tripType || "roundtrip",
  );

  // Set minimum date to today if empty
  useEffect(() => {
    if (!departureDate) {
      const today = new Date().toISOString().split("T")[0];
      setDepartureDate(today);
    }
  }, [departureDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate) {
      return;
    }

    const params: SearchParams = {
      originLocationCode: origin.iataCode,
      destinationLocationCode: destination.iataCode,
      departureDate,
      adults,
      max: 50,
    };

    if (tripType === "roundtrip" && returnDate) {
      params.returnDate = returnDate;
    }

    onSearch(params);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl p-8 relative"
    >
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl opacity-50"></div>

      <TripTypeToggle value={tripType} onChange={setTripType} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LocationInput
          label="Origin"
          placeholder="City or airport"
          value={origin}
          onChange={setOrigin}
        />

        <LocationInput
          label="Destination"
          placeholder="Where to?"
          value={destination}
          onChange={setDestination}
          iconRotate
        />

        <DateInput
          label="Departure"
          value={departureDate}
          onChange={setDepartureDate}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <div className="flex gap-4">
          {tripType === "roundtrip" ? (
            <>
              <DateInput
                label="Return"
                value={returnDate}
                onChange={setReturnDate}
                min={departureDate}
              />
              <PassengerSelect
                label="Qty"
                value={adults}
                onChange={setAdults}
                className="w-24"
                showLabelQty
              />
            </>
          ) : (
            <PassengerSelect
              label="Travelers"
              value={adults}
              onChange={setAdults}
              className="flex-1"
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/5 pt-8">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary-600 focus:ring-primary-600/50 transition-all"
            />
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
              Non-stop only
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary-600 focus:ring-primary-600/50 transition-all"
            />
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
              Refundable
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[200px] relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-blue rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="uppercase tracking-widest text-xs">
              Search Kung-fu Flight
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};
