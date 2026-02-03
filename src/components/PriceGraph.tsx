import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PriceDataPoint } from "../types/flight";

interface PriceGraphProps {
  data: PriceDataPoint[];
}

export const PriceGraph: React.FC<PriceGraphProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No price data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Price Analytics
          </h3>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Market trends for your route
          </p>
        </div>
        <div className="text-[10px] font-semibold text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20 uppercase tracking-widest">
          LIVE DATA
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
              axisLine={false}
              tickLine={false}
              height={40}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)", radius: 8 }}
              contentStyle={{
                backgroundColor: "#1a1d23",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
              }}
              itemStyle={{
                color: "#0ea5e9",
                fontWeight: "black",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
              labelStyle={{
                color: "#f8fafc",
                fontWeight: "bold",
                marginBottom: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} flights`, "Volume"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === Math.floor(data.length / 2)
                      ? "#0ea5e9"
                      : "rgba(14, 165, 233, 0.3)"
                  }
                  className="transition-all duration-300 hover:fill-primary-400"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
          Sample size: {data.reduce((sum, d) => sum + d.count, 0)} results
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Average
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500/30"></div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Other
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
