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
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome back!</h2>
      <p className="text-gray-800 mb-6">
        Anything different from your last experience? We'd love to know.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's new, better, or worse since your last visit?"
          rows={5}
          className="w-full border border-gray-400 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-3 text-lg font-semibold disabled:opacity-50 transition"
        >
          {loading ? "Sending…" : "Share Feedback"}
        </button>
      </form>
    </div>
  );
}
