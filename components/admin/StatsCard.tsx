interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  /** Brand/semantic accent colour for the icon tint. Defaults to sky blue. */
  accent?: string;
  /** Optional inline SVG icon. */
  icon?: React.ReactNode;
  /** Optional node rendered next to the value (e.g. stars or a growth pill). */
  extra?: React.ReactNode;
}

export default function StatsCard({ label, value, sub, accent = "#00ADDE", icon, extra }: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            {icon}
          </span>
        )}
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {extra}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
