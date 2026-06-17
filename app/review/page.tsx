"use client";

import { useState } from "react";
import ProgressBar from "@/components/review/ProgressBar";
import PhoneStep from "@/components/review/PhoneStep";
import DiscoveryStep from "@/components/review/DiscoveryStep";
import PriceStep from "@/components/review/PriceStep";
import PurchaseReasonStep from "@/components/review/PurchaseReasonStep";
import StaffRatingStep from "@/components/review/StaffRatingStep";
import ReturnVisitForm from "@/components/review/ReturnVisitForm";
import ThankYou from "@/components/review/ThankYou";
import type { ReviewFormState, FormStep, DiscoveryChannel } from "@/lib/types";

const TOTAL_STEPS = 5;

const STEP_NUMBER: Record<FormStep, number> = {
  phone: 1,
  discovery: 2,
  price: 3,
  purchase: 4,
  staff: 5,
  done: 5,
};

export default function ReviewPage() {
  const [step, setStep] = useState<FormStep>("phone");
  const [isReturning, setIsReturning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState<ReviewFormState>({
    phone: "",
    discovery_channel: "",
    discovery_other: "",
    price_rating: null,
    purchase_reason: "",
    staff_rating: null,
    staff_feedback: "",
  });

  function update<K extends keyof ReviewFormState>(key: K, val: ReviewFormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handlePhoneNext(phone: string, returning: boolean) {
    update("phone", phone);
    setIsReturning(returning);
    setStep(returning ? "done" : "discovery");
  }

  async function handleSubmit() {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: form.phone,
          discovery_channel: form.discovery_channel,
          discovery_other: form.discovery_other || undefined,
          price_rating: form.price_rating,
          purchase_reason: form.purchase_reason,
          staff_rating: form.staff_rating,
          staff_feedback: form.staff_feedback || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStep("done");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const showProgress = step !== "phone" && step !== "done" && !isReturning;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Brand header */}
      <div style={{ backgroundColor: "#E8174B" }} className="text-white text-center py-5 px-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 mb-0.5">Discount Centre</p>
        <h1 className="text-xl font-bold tracking-tight">Share Your Experience</h1>
      </div>

      {/* Form card */}
      <div className="flex-1 flex items-start justify-center p-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-7">
          {showProgress && (
            <ProgressBar current={STEP_NUMBER[step]} total={TOTAL_STEPS} />
          )}

          {step === "phone" && (
            <PhoneStep onNext={handlePhoneNext} />
          )}

          {step === "discovery" && (
            <DiscoveryStep
              value={form.discovery_channel}
              otherValue={form.discovery_other}
              onChange={(ch: DiscoveryChannel, other: string) => {
                update("discovery_channel", ch);
                update("discovery_other", other);
              }}
              onNext={() => setStep("price")}
              onBack={() => setStep("phone")}
            />
          )}

          {step === "price" && (
            <PriceStep
              value={form.price_rating}
              onChange={(n) => update("price_rating", n)}
              onNext={() => setStep("purchase")}
              onBack={() => setStep("discovery")}
            />
          )}

          {step === "purchase" && (
            <PurchaseReasonStep
              value={form.purchase_reason}
              onChange={(v) => update("purchase_reason", v)}
              onNext={() => setStep("staff")}
              onBack={() => setStep("price")}
            />
          )}

          {step === "staff" && (
            <StaffRatingStep
              value={form.staff_rating}
              feedback={form.staff_feedback}
              onRatingChange={(n) => update("staff_rating", n)}
              onFeedbackChange={(t) => update("staff_feedback", t)}
              onNext={handleSubmit}
              onBack={() => setStep("purchase")}
              loading={submitting}
            />
          )}

          {isReturning && step === "done" && (
            <ReturnVisitForm phone={form.phone} onDone={() => setIsReturning(false)} />
          )}

          {!isReturning && step === "done" && <ThankYou />}

          {formError && (
            <p className="text-red-500 text-sm text-center mt-4">{formError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
