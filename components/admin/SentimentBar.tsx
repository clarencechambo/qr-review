import type { SentimentSlice } from "@/lib/analytics";

interface SentimentBarProps {
  slices: SentimentSlice[];
  emptyMessage?: string;
}

export default function SentimentBar({ slices, emptyMessage = "No reviews yet." }: SentimentBarProps) {
  const total = slices.reduce((s, x) => s + x.count, 0);
  if (total === 0) {
    return <p className="text-sm text-gray-400 py-4">{emptyMessage}</p>;
  }

  return (
    <div>
      {/* Segmented bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100">
        {slices.map((s) =>
          s.count > 0 ? (
            <div
              key={s.key}
              style={{ width: `${s.percent}%`, backgroundColor: s.color }}
              title={`${s.key}: ${s.count} (${s.percent}%)`}
            />
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
        {slices.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-700">{s.key}</span>
            <span className="font-semibold text-gray-900">{s.percent}%</span>
            <span className="text-gray-400">({s.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
