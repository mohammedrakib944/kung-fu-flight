import React from 'react';
import { FlightOffer } from '../types/flight';
import { getAirlineName } from '../utils/flightUtils';
import { Itinerary } from './Flight/Itinerary';
import { AirlineBadge } from './Flight/AirlineBadge';
import { PriceAction } from './Flight/PriceAction';

interface FlightCardProps {
  flight: FlightOffer;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const outbound = flight.itineraries[0];
  const airline = getAirlineName(flight.validatingAirlineCodes[0]);

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-8 mb-6 border border-white/5 group transition-all duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
        <div className="flex-1">
          <AirlineBadge 
            airlineName={airline} 
            airlineCodes={flight.validatingAirlineCodes} 
          />

          <div className="space-y-10">
            <Itinerary 
              itinerary={outbound} 
              label={flight.itineraries.length > 1 ? 'Departure' : 'Journey'} 
            />
            {flight.itineraries.length > 1 && (
              <div className="pt-10 border-t border-white/5 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-50 border border-white/5 px-4 py-0.5 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Return Leg</div>
                <Itinerary 
                  itinerary={flight.itineraries[1]} 
                  label="Return" 
                />
              </div>
            )}
          </div>
        </div>

        <PriceAction 
          currency={flight.price.currency} 
          total={flight.price.total} 
        />
      </div>
    </div>
  );
};
