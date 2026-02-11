"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-card-border bg-card-bg p-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-accent">Đóng: {d.close?.toLocaleString()}đ</p>
      <p className="text-muted">KL: {(d.volume / 1_000_000).toFixed(1)}M</p>
    </div>
  );
}

export default function PriceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          domain={["dataMin - 1000", "dataMax + 1000"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="close"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#priceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
