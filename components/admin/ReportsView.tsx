"use client";

import { useMemo, useState } from "react";
import type { Review, ReturnVisit } from "@/lib/types";
import {
  PRICE_LABELS,
  buildComplaintReport,
  formatEat,
  recentPeriods,
  type PeriodType,
} from "@/lib/report";
import StatsCard from "@/components/admin/StatsCard";
import BarList from "@/components/admin/charts/BarList";
import Stars from "@/components/admin/Stars";
import { IconChurn, IconPrice, IconReviews, IconStaff } from "@/components/admin/icons";

interface ReportsViewProps {
  reviews: Review[];
  returns: ReturnVisit[];
  /** Server time, so the period list matches between server and client render. */
  now: number;
}

const PERIOD_COUNT = 12;

export default function ReportsView({ reviews, returns, now }: ReportsViewProps) {
  const [type, setType] = useState<PeriodType>("month");
  const periods = useMemo(() => recentPeriods(type, PERIOD_COUNT, now), [type, now]);
  const [key, setKey] = useState(periods[0].key);
  const period = periods.find((p) => p.key === key) ?? periods[0];

  const report = useMemo(
    () => buildComplaintReport(reviews, returns, period),
    [reviews, returns, period]
  );

  function switchType(next: PeriodType) {
    setType(next);
    setKey(recentPeriods(next, 1, now)[0].key);
  }

  const unit = type === "week" ? "week" : "month";
  const delta =
    report.previousComplaintRate === null
      ? null
      : Math.round((report.complaintRate - report.previousComplaintRate) * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaint Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            Reviews under 4 stars — your churn-risk indicator, with the reasons behind it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
            {(["week", "month"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchType(t)}
                className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: type === t ? "#E8174B" : "transparent",
                  color: type === t ? "#fff" : "#4b5563",
                }}
              >
                {t === "week" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>

          <select
            value={period.key}
            onChange={(e) => setKey(e.target.value)}
            aria-label={`Select ${unit}`}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
          >
            {periods.map((p, i) => (
              <option key={p.key} value={p.key}>
                {p.label}
                {i === 0 ? ` (this ${unit})` : ""}
              </option>
            ))}
          </select>

          <a
            href={`/api/admin/report?type=${type}&start=${period.key}`}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#00ADDE" }}
          >
            Download Excel
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Complaint rate"
          value={report.totalReviews ? `${report.complaintRate}%` : "—"}
          sub={
            delta === null
              ? `No data for the previous ${unit}`
              : `${delta > 0 ? "+" : ""}${delta} pts vs previous ${unit}`
          }
          accent="#E8174B"
          icon={<IconChurn />}
        />
        <StatsCard
          label="Complaints"
          value={report.complaints}
          sub={`of ${report.totalReviews} review${report.totalReviews === 1 ? "" : "s"}`}
          accent="#f59e0b"
          icon={<IconReviews />}
        />
        <StatsCard
          label="Price complaints"
          value={report.priceComplaints}
          sub="felt prices were high"
          accent="#00ADDE"
          icon={<IconPrice />}
        />
        <StatsCard
          label="Average staff rating"
          value={report.averageStaffRating || "—"}
          sub="out of 5"
          accent="#10b981"
          icon={<IconStaff />}
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h3 className="font-semibold text-gray-900">
            Complaints — {period.label} ({report.rows.length})
          </h3>
          {report.complaintsWithoutReason > 0 && (
            <p className="text-xs text-gray-500">
              {report.complaintsWithoutReason} complaint
              {report.complaintsWithoutReason === 1 ? " has" : "s have"} no reason given
            </p>
          )}
        </div>

        {report.rows.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            {report.totalReviews === 0
              ? `No reviews this ${unit}.`
              : `No complaints this ${unit}.`}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {report.rows.map(({ review: r, types }) => (
              <li key={r.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.name || "Customer"}</p>
                    <p className="text-xs text-gray-500">
                      <a
                        href={`tel:${r.phone_number}`}
                        className="font-mono select-all hover:underline"
                        style={{ color: "#00ADDE" }}
                      >
                        {r.phone_number}
                      </a>
                      {" · "}
                      {formatEat(r.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars value={r.staff_rating} />
                    {types.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={
                          t === "Price"
                            ? { backgroundColor: "#00ADDE1a", color: "#0284a8" }
                            : { backgroundColor: "#E8174B1a", color: "#C9123E" }
                        }
                      >
                        {t === "Price" ? PRICE_LABELS[r.price_rating] : "Low staff rating"}
                      </span>
                    ))}
                  </div>
                </div>
                {types.includes("Staff rating") && (
                  <p
                    className={`mt-2 text-sm ${r.staff_feedback?.trim() ? "text-gray-800" : "text-gray-400 italic"}`}
                  >
                    {r.staff_feedback?.trim()
                      ? `“${r.staff_feedback.trim()}”`
                      : "No reason given"}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Staff rating breakdown</h3>
          <BarList
            rows={report.ratingBreakdown.map((b, i) => ({
              label: b.label,
              value: b.count,
              // 5★ and 4★ positive, 3★ and below complaints
              color: i < 2 ? "#10b981" : "#E8174B",
            }))}
            emptyMessage={`No reviews this ${unit}.`}
          />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Complaints by how they found us</h3>
          <BarList
            rows={report.complaintsByChannel.map((c) => ({
              label: c.label,
              value: c.count,
              color: "#E8174B",
            }))}
            emptyMessage={`No complaints this ${unit}.`}
          />
        </div>
      </div>
    </div>
  );
}
