"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="w-full mb-7">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8174B" }}>
          Step {current} of {total}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      {/* Segmented progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-500"
            style={{ backgroundColor: i < current ? "#E8174B" : "#f0f0f1" }}
          />
        ))}
      </div>
    </div>
  );
}
