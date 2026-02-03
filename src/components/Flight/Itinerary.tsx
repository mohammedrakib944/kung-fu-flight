import React from "react";
import { Plane } from "lucide-react";
import {
  formatDuration,
  formatTime,
  formatDate,
} from "../../utils/flightUtils";

interface ItineraryProps {
  itinerary: any;
  label: string;
}

export const Itinerary: React.FC<ItineraryProps> = ({ itinerary, label }) => {
  const first = itinerary.segments[0];
  const last = itinerary.segments[itinerary.segments.length - 1];
  const stopsCount = itinerary.segments.length - 1;

  return (
    <div className="relative">
      <div className="text-[10px] font-semibold text-primary-500 uppercase tracking-[0.2em] mb-4 bg-primary-500/5 w-fit px-2 py-0.5 rounded-md border border-primary-500/10 inline-block">
        {label}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-3xl font-semibold text-white tracking-tighter mb-1">
            {formatTime(first.departure.at)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              {first.departure.iataCode}
            </span>
            <span className="text-[10px] font-medium text-gray-500">
              {formatDate(first.departure.at)}
            </span>
          </div>
        </div>

        <div className="flex-[1.5] flex flex-col items-center px-4 relative">
          <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">
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
            <div
              className={`w-1.5 h-1.5 rounded-full ${stopsCount === 0 ? "bg-emerald-500" : "bg-amber-500"}`}
            ></div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              {stopsCount === 0
                ? "Direct"
                : `${stopsCount} ${stopsCount === 1 ? "Transfer" : "Transfers"}`}
            </span>
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="text-3xl font-semibold text-white tracking-tighter mb-1">
            {formatTime(last.arrival.at)}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] font-medium text-gray-500">
              {formatDate(last.arrival.at)}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {last.arrival.iataCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
