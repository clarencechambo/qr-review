import { createServerClient } from "@/lib/supabase/server";
import ReviewsBrowser from "@/components/admin/ReviewsBrowser";
import SentimentBar from "@/components/admin/SentimentBar";
import Stars from "@/components/admin/Stars";
import { averageRating, sentimentDistribution, growthStats } from "@/lib/analytics";
import { IconTrendUp, IconTrendDown } from "@/components/admin/icons";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const reviews: Review[] = (data ?? []) as Review[];
  const avg = averageRating(reviews);
  const sentiment = sentimentDistribution(reviews);
  const growth = growthStats(reviews);
  const up = growth.percent >= 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

      {/* Summary header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[auto_auto_1fr] md:items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900">{reviews.length}</span>
              {reviews.length > 0 && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: up ? "#10b9811a" : "#ef44441a",
                    color: up ? "#059669" : "#dc2626",
                  }}
                >
                  {up ? <IconTrendUp /> : <IconTrendDown />}
                  {up ? "+" : ""}{growth.percent}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </div>

          <div className="md:px-8 md:border-l md:border-gray-100">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900">{avg || "—"}</span>
              <Stars value={Math.round(avg)} />
            </div>
            <p className="text-xs text-gray-400 mt-1">staff experience</p>
          </div>

          <div className="md:pl-8 md:border-l md:border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-3">Sentiment breakdown</p>
            <SentimentBar slices={sentiment} />
          </div>
        </div>
      </div>

      {/* Review browser */}
      <ReviewsBrowser reviews={reviews} />
    </div>
  );
}
