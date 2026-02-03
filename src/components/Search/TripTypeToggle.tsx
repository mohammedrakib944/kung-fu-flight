import React from "react";

interface TripTypeToggleProps {
  value: "roundtrip" | "oneway";
  onChange: (value: "roundtrip" | "oneway") => void;
}

export const TripTypeToggle: React.FC<TripTypeToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex gap-2 mb-8 p-1 bg-white/5 w-fit rounded-2xl border border-white/5">
      <button
        type="button"
        onClick={() => onChange("roundtrip")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          value === "roundtrip"
            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        Round Trip
      </button>
      <button
        type="button"
        onClick={() => onChange("oneway")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          value === "oneway"
            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        One Way
      </button>
    </div>
  );
};
