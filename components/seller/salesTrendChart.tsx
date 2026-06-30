"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

export default function SalesTrendChart({
  data,
}: {
  data: {
    date: string;
    revenue: number;
  }[];
}) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            fill="#bfdbfe"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}