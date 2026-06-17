export interface BarRow {
  label: string;
  value: number;
  /** Optional text shown on the right instead of the raw value (e.g. "42%"). */
  display?: string;
  color?: string;
}

interface BarListProps {
  rows: BarRow[];
  /** Override the max used to scale bars; defaults to the largest value (min 1). */
  max?: number;
  emptyMessage?: string;
}

export default function BarList({ rows, max, emptyMessage = "No data yet." }: BarListProps) {
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (total === 0) {
    return <p className="text-sm text-gray-400 py-4">{emptyMessage}</p>;
  }
  const scale = max ?? Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="text-sm w-40 shrink-0 text-gray-700">{row.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(row.value / scale) * 100}%`,
                backgroundColor: row.color ?? "#00ADDE",
              }}
            />
          </div>
          <span className="text-sm w-12 text-right font-medium text-gray-900">
            {row.display ?? row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
