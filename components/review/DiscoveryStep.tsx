"use client";

import { useState } from "react";
import { DISCOVERY_OPTIONS, type DiscoveryChannel } from "@/lib/types";

interface DiscoveryStepProps {
  value: DiscoveryChannel | "";
  otherValue: string;
  onChange: (channel: DiscoveryChannel, other: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DiscoveryStep({
  value,
  otherValue,
  onChange,
  onNext,
  onBack,
}: DiscoveryStepProps) {
  const [error, setError] = useState("");

  function handleSelect(option: DiscoveryChannel) {
    onChange(option, option === "Other" ? otherValue : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) { setError("Please select an option."); return; }
    if (value === "Other" && !otherValue.trim()) {
      setError("Please tell us how you found us.");
      return;
    }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">How did you first find us?</h2>
      <p className="text-gray-800 mb-6">Pick the option that fits best.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {DISCOVERY_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className={`w-full text-left border rounded-xl px-4 py-3 font-medium transition ${
              value === opt
                ? "border-black bg-black text-white"
                : "border-gray-400 text-gray-900 hover:border-black"
            }`}
          >
            {opt}
          </button>
        ))}
        {value === "Other" && (
          <textarea
            value={otherValue}
            onChange={(e) => onChange("Other", e.target.value)}
            placeholder="Please describe how you found us…"
            rows={2}
            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex-1 border border-gray-400 rounded-xl py-3 font-semibold text-gray-900">
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
