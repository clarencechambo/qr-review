"use client";

import { useState } from "react";

interface PriceStepProps {
  value: number | null;
  onChange: (rating: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { n: number; label: string; emoji: string }[] = [
  { n: 1, label: "Much cheaper", emoji: "💰" },
  { n: 2, label: "A bit cheaper", emoji: "🤑" },
  { n: 3, label: "About the same", emoji: "👌" },
  { n: 4, label: "A bit pricier", emoji: "🙂" },
  { n: 5, label: "Much pricier", emoji: "😬" },
];

export default function PriceStep({ value, onChange, onNext, onBack }: PriceStepProps) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) { setError("Please select an option."); return; }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 text-gray-900">How were our prices?</h2>
      <p className="text-gray-600 mb-5 text-sm">Compared to other stores you've visited.</p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {OPTIONS.map(({ n, label, emoji }) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="w-full text-left border rounded-full px-5 py-3 text-sm font-medium transition-all flex items-center gap-3"
              style={{
                backgroundColor: selected ? "#E8174B" : "#fff",
                borderColor: selected ? "#E8174B" : "#e5e7eb",
                color: selected ? "#fff" : "#111827",
              }}
            >
              <span className="text-lg">{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-700 bg-white hover:border-gray-400 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 text-white rounded-full py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#E8174B" }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
