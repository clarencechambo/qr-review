"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/lib/types";
import { SENTIMENT_TIERS } from "@/lib/analytics";
import ReviewCard from "@/components/admin/ReviewCard";
import { IconSearch } from "@/components/admin/icons";

interface ReviewsBrowserProps {
  reviews: Review[];
}

type Filter = "All" | (typeof SENTIMENT_TIERS)[number]["key"];

export default function ReviewsBrowser({ reviews }: ReviewsBrowserProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filter !== "All") {
        const tier = SENTIMENT_TIERS.find((t) => t.key === filter);
        if (tier && r.staff_rating !== tier.rating) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${r.phone_number} ${r.purchase_reason} ${r.staff_feedback ?? ""} ${r.discovery_channel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reviews, filter, search]);

  const chips: Filter[] = ["All", ...SENTIMENT_TIERS.map((t) => t.key)];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const active = filter === c;
            const tier = SENTIMENT_TIERS.find((t) => t.key === c);
            const accent = tier?.color ?? "#E8174B";
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: active ? accent : "#fff",
                  borderColor: active ? accent : "#e5e7eb",
                  color: active ? "#fff" : "#374151",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews…"
            className="w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          {reviews.length === 0 ? "No reviews yet." : "No reviews match your filters."}
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
