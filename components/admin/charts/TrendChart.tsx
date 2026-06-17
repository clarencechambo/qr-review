import type { WeekBucket } from "@/lib/analytics";

interface TrendChartProps {
  data: WeekBucket[];
  emptyMessage?: string;
}

export default function TrendChart({ data, emptyMessage = "No data yet." }: TrendChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">{emptyMessage}</p>;
  }

  const width = 640;
  const height = 200;
  const padX = 32;
  const padY = 24;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = height - padY - (d.count / maxCount) * (height - padY * 2);
    return { x, y, d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padY} ` +
    `L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Reviews over time">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ADDE" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00ADDE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendFill)" />
      <path d={linePath} fill="none" stroke="#00ADDE" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p) => (
        <g key={p.d.weekLabel}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#00ADDE" />
          {p.d.count > 0 && (
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-gray-700" style={{ fontSize: 11, fontWeight: 600 }}>
              {p.d.count}
            </text>
          )}
          <text x={p.x} y={height - 6} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 10 }}>
            {p.d.weekLabel}
          </text>
        </g>
      ))}
    </svg>
  );
}
