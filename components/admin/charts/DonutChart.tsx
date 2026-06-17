export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue?: string;
  centerLabel?: string;
  size?: number;
  emptyMessage?: string;
}

export default function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 180,
  emptyMessage = "No data yet.",
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-400"
        style={{ height: size }}
      >
        {emptyMessage}
      </div>
    );
  }

  const stroke = size * 0.14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((seg) => {
            const fraction = seg.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
        {centerValue && (
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-900"
            style={{ fontSize: size * 0.2, fontWeight: 700 }}
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-500"
            style={{ fontSize: size * 0.075 }}
          >
            {centerLabel}
          </text>
        )}
      </svg>

      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-gray-700">{seg.label}</span>
            <span className="font-semibold text-gray-900">{seg.value}</span>
            <span className="text-gray-400">
              ({Math.round((seg.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
