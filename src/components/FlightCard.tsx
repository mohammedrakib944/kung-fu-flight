import React from 'react';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import { FlightOffer } from '../types/flight';
import {
  formatDuration,
  formatTime,
  formatDate,
  getNumberOfStops,
  getAirlineName,
} from '../utils/flightUtils';

interface FlightCardProps {
  flight: FlightOffer;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const stops = getNumberOfStops(flight);
  const airline = getAirlineName(flight.validatingAirlineCodes[0]);

  const renderItinerary = (itinerary: any, label: string) => {
    const first = itinerary.segments[0];
    const last = itinerary.segments[itinerary.segments.length - 1];
    const stops = itinerary.segments.length - 1;

    return (
      <div className="mb-4 last:mb-0">
        <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(first.departure.at)}
            </div>
            <div className="text-sm text-gray-600">{first.departure.iataCode}</div>
            <div className="text-xs text-gray-500">{formatDate(first.departure.at)}</div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <div className="text-sm text-gray-600 mb-1">
              {formatDuration(itinerary.duration)}
            </div>
            <div className="flex items-center w-full">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <Plane className="w-4 h-4 text-gray-400 mx-2 rotate-90" />
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stops === 0 ? 'Non-stop' : `${stops} ${stops === 1 ? 'stop' : 'stops'}`}
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(last.arrival.at)}
            </div>
            <div className="text-sm text-gray-600">{last.arrival.iataCode}</div>
            <div className="text-xs text-gray-500">{formatDate(last.arrival.at)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{airline}</div>
              <div className="text-sm text-gray-600">
                {flight.validatingAirlineCodes.join(', ')}
              </div>
            </div>
          </div>

          {renderItinerary(outbound, flight.itineraries.length > 1 ? 'Outbound' : 'Flight')}
          {flight.itineraries.length > 1 && renderItinerary(flight.itineraries[1], 'Return')}
        </div>

        <div className="md:ml-6 md:pl-6 md:border-l border-gray-200 text-center md:text-right">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {flight.price.currency} {parseFloat(flight.price.total).toFixed(2)}
          </div>
          <button className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition">
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
};
