import React from "react";
import { Plane } from "lucide-react";

interface AirlineBadgeProps {
  airlineName: string;
  airlineCodes: string[];
}

export const AirlineBadge: React.FC<AirlineBadgeProps> = ({
  airlineName,
  airlineCodes,
}) => {
  return (
    <div className="flex items-center gap-5 mb-10">
      <div className="relative">
        <div className="absolute -inset-2 bg-primary-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent"></div>
          <Plane className="w-9 h-9 text-primary-400 rotate-0 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-white tracking-tight leading-none mb-1">
          {airlineName}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded border border-white/5">
            {airlineCodes.join(", ")}
          </span>
          <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
          <span className="text-[10px] font-semibold text-primary-500 uppercase tracking-[0.2em]">
            Premium Economy
          </span>
        </div>
      </div>
    </div>
  );
};
