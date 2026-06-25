"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EyeIcon, EyeOffIcon } from "@/components/admin/icons";

const ALLOWED_DOMAIN = "@discountcentre.co.tz";

export default function AdminSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Use your company email (ending in ${ALLOWED_DOMAIN}).`);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      const msg = signUpError.message?.toLowerCase() ?? "";
      if (msg.includes("registered") || msg.includes("already")) {
        setError("An account with this email already exists. Try signing in.");
      } else if (msg.includes("discountcentre")) {
        setError(`Only ${ALLOWED_DOMAIN} emails may register.`);
      } else {
        setError("Could not create the account. Please try again.");
      }
      return;
    }

    if (data.session) {
      router.push("/admin");
      router.refresh();
    } else {
      setInfo("Account created. You can now sign in.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      <div style={{ backgroundColor: "#E8174B" }} className="text-white text-center py-5 px-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 mb-0.5">Discount Centre</p>
        <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Staff sign-up — use your <span className="font-medium">{ALLOWED_DOMAIN}</span> email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`you${ALLOWED_DOMAIN}`}
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition bg-gray-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition bg-gray-50"
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-100">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-xl px-4 py-3 text-sm text-green-800 bg-green-50 border border-green-100">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-colors mt-2"
              style={{ backgroundColor: "#E8174B" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>

            <a href="/admin/login" className="block text-center text-sm font-semibold text-gray-500 hover:text-gray-700">
              Already have an account? Sign in
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
