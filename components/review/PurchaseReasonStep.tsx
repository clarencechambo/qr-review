"use client";

import { useState } from "react";

interface PurchaseReasonStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESETS = [
  "Good prices",
  "Great selection",
  "Friendly staff",
  "Convenience / location",
  "Quality products",
  "A specific deal or promotion",
  "Other",
];

export default function PurchaseReasonStep({
  value,
  onChange,
  onNext,
  onBack,
}: PurchaseReasonStepProps) {
  const [error, setError] = useState("");

  function handlePreset(preset: string) {
    onChange(preset);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) { setError("Please tell us what made you buy today."); return; }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">What made you buy today?</h2>
      <p className="text-gray-800 mb-4">The one thing that sealed the deal.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePreset(preset)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              value === preset
                ? "bg-black text-white border-black"
                : "bg-white text-gray-900 border-gray-400 hover:border-black"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or type your own reason…"
          rows={3}
          className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-400 rounded-xl py-3 font-semibold text-gray-900"
          >
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
