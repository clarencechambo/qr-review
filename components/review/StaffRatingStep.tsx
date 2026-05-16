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

const STARS = [5, 4, 3, 2, 1];

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
      <h2 className="text-2xl font-bold mb-2">How was our staff?</h2>
      <p className="text-gray-600 mb-6">Rate your experience with our team.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-3">
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className={`text-4xl transition-transform hover:scale-110 ${
                value !== null && star <= value ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {value !== null && (
          <p className="text-center text-sm text-gray-500">
            {value === 5 ? "Excellent!" : value === 4 ? "Great" : value === 3 ? "Good" : value === 2 ? "Needs improvement" : "Poor"}
          </p>
        )}
        {value !== null && value <= 2 && feedback && (
          <p className="text-sm text-gray-500 italic text-center">"{feedback}"</p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex-1 border border-gray-300 rounded-xl py-3 font-semibold">
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white rounded-xl py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-2">We're sorry to hear that.</h3>
            <p className="text-gray-600 text-sm mb-4">What could we have done better?</p>
            <textarea
              value={modalFeedback}
              onChange={(e) => setModalFeedback(e.target.value)}
              rows={3}
              placeholder="Tell us more…"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none mb-4"
            />
            <button
              onClick={handleModalSubmit}
              className="w-full bg-black text-white rounded-xl py-2 font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
