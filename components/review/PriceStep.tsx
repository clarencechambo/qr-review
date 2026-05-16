"use client";

import { useState } from "react";

interface PriceStepProps {
  value: number | null;
  onChange: (rating: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const LABELS: Record<number, string> = {
  1: "Much cheaper",
  2: "A bit cheaper",
  3: "About the same",
  4: "A bit pricier",
  5: "Much pricier",
};

export default function PriceStep({ value, onChange, onNext, onBack }: PriceStepProps) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) { setError("Please select a rating."); return; }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">How were our prices?</h2>
      <p className="text-gray-600 mb-6">Compared to other stores you've visited.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-full text-left border rounded-xl px-4 py-3 transition flex items-center gap-3 ${
              value === n
                ? "border-black bg-black text-white"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            <span className="text-xl font-bold">{n}</span>
            <span>{LABELS[n]}</span>
          </button>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex-1 border border-gray-300 rounded-xl py-3 font-semibold">
            Back
          </button>
          <button type="submit" className="flex-1 bg-black text-white rounded-xl py-3 font-semibold">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
