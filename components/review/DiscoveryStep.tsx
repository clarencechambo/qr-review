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
      <h2 className="text-2xl font-bold mb-1 text-gray-900">How did you find us?</h2>
      <p className="text-gray-600 mb-5 text-sm">Pick the option that fits best.</p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {DISCOVERY_OPTIONS.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className="w-full text-left border rounded-full px-5 py-3 text-sm font-medium transition-all"
              style={{
                backgroundColor: selected ? "#E8174B" : "#fff",
                borderColor: selected ? "#E8174B" : "#e5e7eb",
                color: selected ? "#fff" : "#111827",
              }}
            >
              {opt}
            </button>
          );
        })}
        {value === "Other" && (
          <textarea
            value={otherValue}
            onChange={(e) => onChange("Other", e.target.value)}
            placeholder="Please describe how you found us…"
            rows={2}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none text-sm transition"
            style={{ "--tw-ring-color": "#E8174B33", focusBorderColor: "#E8174B" } as React.CSSProperties}
          />
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-700 bg-white transition hover:border-gray-400"
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
