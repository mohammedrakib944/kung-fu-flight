import React from 'react';
import { Plane, ArrowRight } from 'lucide-react';
import { FlightOffer } from '../types/flight';
import {
  formatDuration,
  formatTime,
  formatDate,
  getAirlineName,
} from '../utils/flightUtils';

interface FlightCardProps {
  flight: FlightOffer;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const outbound = flight.itineraries[0];
  const airline = getAirlineName(flight.validatingAirlineCodes[0]);

  const renderItinerary = (itinerary: any, label: string) => {
    const first = itinerary.segments[0];
    const last = itinerary.segments[itinerary.segments.length - 1];
    const stopsCount = itinerary.segments.length - 1;

    return (
      <div className="relative">
        <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-4 bg-primary-500/5 w-fit px-2 py-0.5 rounded-md border border-primary-500/10 inline-block">{label}</div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-3xl font-black text-white tracking-tighter mb-1">
              {formatTime(first.departure.at)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-300">{first.departure.iataCode}</span>
              <span className="text-[10px] font-medium text-gray-500">{formatDate(first.departure.at)}</span>
            </div>
          </div>

          <div className="flex-[1.5] flex flex-col items-center px-4 relative">
            <div className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">
              {formatDuration(itinerary.duration)}
            </div>
            <div className="flex items-center w-full group/path">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/20 rounded-full"></div>
              <div className="relative px-3">
                <Plane className="w-4 h-4 text-primary-500 rotate-90" />
                <div className="absolute inset-0 bg-primary-500/20 blur-md rounded-full animate-pulse"></div>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-full"></div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${stopsCount === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stopsCount === 0 ? 'Direct' : `${stopsCount} ${stopsCount === 1 ? 'Transfer' : 'Transfers'}`}
              </span>
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-3xl font-black text-white tracking-tighter mb-1">
              {formatTime(last.arrival.at)}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] font-medium text-gray-500">{formatDate(last.arrival.at)}</span>
              <span className="text-sm font-bold text-gray-300">{last.arrival.iataCode}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-8 mb-6 border border-white/5 group transition-all duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-5 mb-10">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent"></div>
                <Plane className="w-9 h-9 text-primary-400 rotate-0 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight leading-none mb-1">{airline}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded border border-white/5">
                  {flight.validatingAirlineCodes.join(', ')}
                </span>
                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Premium Economy</span>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {renderItinerary(outbound, flight.itineraries.length > 1 ? 'Departure' : 'Journey')}
            {flight.itineraries.length > 1 && (
              <div className="pt-10 border-t border-white/5 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-50 border border-white/5 px-4 py-0.5 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Return Leg</div>
                {renderItinerary(flight.itineraries[1], 'Return')}
              </div>
            )}
          </div>
        </div>

        <div className="xl:w-80 xl:pl-10 xl:border-l border-white/5 flex flex-col justify-center items-center xl:items-end">
          <div className="mb-8 text-center xl:text-right">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Total Price</div>
            <div className="flex items-baseline gap-2 justify-center xl:justify-end">
              <span className="text-2xl font-black text-primary-500 tracking-tighter">{flight.price.currency}</span>
              <span className="text-6xl font-black text-white tracking-tighter">
                {Math.floor(parseFloat(flight.price.total))}
                <span className="text-2xl text-white/30 font-medium">.{(parseFloat(flight.price.total) % 1).toFixed(2).split('.')[1]}</span>
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-2 justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                Lowest Price in 30 Days
              </div>
            </div>
          </div>
          
          <button className="w-full relative group/btn overflow-hidden rounded-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-accent-blue to-accent-purple rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-3 py-5 px-10 bg-white text-black font-black rounded-2xl transition-all duration-300 group-hover/btn:bg-primary-600 group-hover/btn:text-white group-hover/btn:shadow-2xl group-hover/btn:shadow-primary-600/40 translate-z-0">
              <span className="uppercase tracking-[0.2em] text-[10px]">Select Flight</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
