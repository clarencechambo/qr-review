"use client";

import { useState } from "react";

interface PurchaseReasonStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PurchaseReasonStep({
  value,
  onChange,
  onNext,
  onBack,
}: PurchaseReasonStepProps) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) { setError("Please tell us what made you buy today."); return; }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What made you buy today?</h2>
      <p className="text-gray-600 mb-6">The one thing that sealed the deal.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Great selection, friendly staff, good price…"
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
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
