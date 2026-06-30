"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatusDonut({
  data,
}: {
  data: {
    label: string;
    count: number;
    color: string;
  }[];
}) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={70}
            outerRadius={100}
          >
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={entry.color}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}