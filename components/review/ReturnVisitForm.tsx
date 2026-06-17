"use client";

import { useState } from "react";

interface ReturnVisitFormProps {
  phone: string;
  onDone: () => void;
}

export default function ReturnVisitForm({ phone, onDone }: ReturnVisitFormProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) { setError("Please share your thoughts."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submit-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, experience_note: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Welcome back!</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Anything different from your last experience? We'd love to know.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's new, better, or worse since your last visit?"
          rows={5}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none transition"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#E8174B" }}
        >
          {loading ? "Sending…" : "Share Feedback"}
        </button>
      </form>
    </div>
  );
}
