"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { BurnoutDataPoint } from "@/types";

interface BurnoutChartProps {
  data: BurnoutDataPoint[];
}

/** @requirement Burnout / wellness trajectory visualization */
export function BurnoutChart({ data }: BurnoutChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div role="img" aria-label="Burnout score trend chart over time">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            aria-label="Date"
          />
          <YAxis
            domain={[0, 100]}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            aria-label="Burnout score"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [`${value ?? 0}/100`, "Burnout Score"]}
          />
          <ReferenceLine
            y={75}
            stroke="#f87171"
            strokeDasharray="5 5"
            label={{ value: "High Risk", fill: "#f87171", fontSize: 11 }}
          />
          <ReferenceLine
            y={50}
            stroke="#fbbf24"
            strokeDasharray="5 5"
            label={{ value: "Moderate", fill: "#fbbf24", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={{ fill: "#a78bfa", r: 4 }}
            activeDot={{ r: 6 }}
            name="Burnout Score"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="sr-only">
        Burnout scores: {formatted.map((d) => `${d.label}: ${d.score}`).join(", ")}
      </p>
    </div>
  );
}
