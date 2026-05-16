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
      <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
      <p className="text-gray-600 mb-6">Enter your phone number to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0712 345 678"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-3 text-lg font-semibold disabled:opacity-50 transition"
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
