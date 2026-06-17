"use client";

import { useState } from "react";
import { normalisePhone } from "@/lib/validation";

interface PhoneStepProps {
  onNext: (phone: string, isReturning: boolean) => void;
}

export default function PhoneStep({ onNext }: PhoneStepProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const normalised = normalisePhone(phone);
    if (normalised.length < 7 || normalised.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/check-phone?phone=${encodeURIComponent(normalised)}`);
      const data = await res.json();
      onNext(normalised, data.exists);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Welcome!</h2>
      <p className="text-gray-600 mb-6 text-sm">Enter your phone number to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0712 345 678"
          className="w-full border border-gray-200 rounded-full px-5 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#E8174B] transition"
          style={{ "--tw-ring-color": "#E8174B33" } as React.CSSProperties}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 transition-colors"
          style={{ backgroundColor: loading ? "#C9123E" : "#E8174B" }}
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
