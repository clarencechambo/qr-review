import type { Review } from "@/lib/types";
import { DISCOVERY_OPTIONS } from "@/lib/types";

interface DiscoveryChartProps {
  reviews: Review[];
}

export default function DiscoveryChart({ reviews }: DiscoveryChartProps) {
  const counts = DISCOVERY_OPTIONS.reduce<Record<string, number>>((acc, opt) => {
    acc[opt] = reviews.filter((r) => r.discovery_channel === opt).length;
    return acc;
  }, {});

  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-3">
      {DISCOVERY_OPTIONS.map((opt) => (
        <div key={opt} className="flex items-center gap-3">
          <span className="text-sm w-36 shrink-0 text-gray-600">{opt}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-black h-4 rounded-full transition-all"
              style={{ width: `${(counts[opt] / max) * 100}%` }}
            />
          </div>
          <span className="text-sm w-6 text-right text-gray-500">{counts[opt]}</span>
        </div>
      ))}
    </div>
  );
}
