"use client";

import { useState } from "react";

interface StaffRatingStepProps {
  value: number | null;
  feedback: string;
  onRatingChange: (rating: number) => void;
  onFeedbackChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

const STARS = [1, 2, 3, 4, 5];

const STAR_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Needs improvement",
  3: "Good",
  4: "Great",
  5: "Excellent!",
};

export default function StaffRatingStep({
  value,
  feedback,
  onRatingChange,
  onFeedbackChange,
  onNext,
  onBack,
  loading,
}: StaffRatingStepProps) {
  const [error, setError] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(feedback);

  function handleStarClick(rating: number) {
    onRatingChange(rating);
    if (rating <= 2) {
      setModalFeedback(feedback);
      setShowFeedbackModal(true);
    }
  }

  function handleModalSubmit() {
    onFeedbackChange(modalFeedback);
    setShowFeedbackModal(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) { setError("Please rate your experience."); return; }
    setError("");
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 text-gray-900">How was our staff?</h2>
      <p className="text-gray-600 mb-6 text-sm">Rate your experience with our team.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2">
          {STARS.map((star) => {
            const filled = value !== null && star <= value;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                style={{ color: filled ? "#FBBF24" : "#D1D5DB" }}
              >
                ★
              </button>
            );
          })}
        </div>
        {value !== null && (
          <p className="text-center text-sm font-semibold" style={{ color: "#E8174B" }}>
            {STAR_LABELS[value]}
          </p>
        )}
        {value !== null && value <= 2 && feedback && (
          <p className="text-sm text-gray-600 italic text-center">"{feedback}"</p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-700 bg-white hover:border-gray-400 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 text-white rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "#E8174B" }}
          >
            {loading ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-1 text-gray-900">We're sorry to hear that.</h3>
            <p className="text-gray-600 text-sm mb-4">What could we have done better?</p>
            <textarea
              value={modalFeedback}
              onChange={(e) => setModalFeedback(e.target.value)}
              rows={3}
              placeholder="Tell us more…"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none mb-4"
            />
            <button
              onClick={handleModalSubmit}
              className="w-full text-white rounded-full py-2.5 font-semibold text-sm"
              style={{ backgroundColor: "#E8174B" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
