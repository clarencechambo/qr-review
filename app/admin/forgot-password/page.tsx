"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError("Could not send the reset email. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      <div style={{ backgroundColor: "#E8174B" }} className="text-white text-center py-5 px-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 mb-0.5">Discount Centre</p>
        <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm text-green-800 bg-green-50 border border-green-100">
                If an account exists for <strong>{email}</strong>, a reset link is on its way.
                Check your inbox (and spam).
              </div>
              <a
                href="/admin/login"
                className="block text-center w-full text-white rounded-full py-3 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#E8174B" }}
              >
                Back to sign in
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition bg-gray-50"
                />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
                style={{ backgroundColor: "#E8174B" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <a href="/admin/login" className="block text-center text-sm font-semibold text-gray-500 hover:text-gray-700">
                Back to sign in
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
