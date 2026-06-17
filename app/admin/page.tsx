import { createServerClient } from "@/lib/supabase/server";
import StatsCard from "@/components/admin/StatsCard";
import BarList from "@/components/admin/charts/BarList";
import DonutChart from "@/components/admin/charts/DonutChart";
import SentimentBar from "@/components/admin/SentimentBar";
import Stars from "@/components/admin/Stars";
import {
  IconReviews,
  IconReturn,
  IconRetention,
  IconStaff,
  IconTrendUp,
  IconTrendDown,
} from "@/components/admin/icons";
import {
  retentionStats,
  sentimentDistribution,
  averageRating,
  growthStats,
} from "@/lib/analytics";
import { DISCOVERY_OPTIONS, type Review, type ReturnVisit } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createServerClient();
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: returnsData } = await supabase.from("return_visits").select("*");

  const reviews: Review[] = reviewsData ?? [];
  const returns: ReturnVisit[] = returnsData ?? [];
  const total = reviews.length;

  const avgStaff = averageRating(reviews, "staff_rating");
  const churn = retentionStats(reviews, returns);
  const sentiment = sentimentDistribution(reviews);
  const growth = growthStats(reviews);
  const up = growth.percent >= 0;

  const discoveryRows = DISCOVERY_OPTIONS.map((opt) => ({
    label: opt,
    value: reviews.filter((r) => r.discovery_channel === opt).length,
    color: "#00ADDE",
  }));

  const growthPill =
    total > 0 ? (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
        style={{
          backgroundColor: up ? "#10b9811a" : "#ef44441a",
          color: up ? "#059669" : "#dc2626",
        }}
      >
        {up ? <IconTrendUp /> : <IconTrendDown />}
        {up ? "+" : ""}
        {growth.percent}%
      </span>
    ) : undefined;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Reviews"
          value={total}
          accent="#E8174B"
          icon={<IconReviews />}
          extra={growthPill}
          sub="vs last month"
        />
        <StatsCard
          label="Average Rating"
          value={avgStaff || "—"}
          accent="#f59e0b"
          icon={<IconStaff />}
          extra={total > 0 ? <Stars value={Math.round(avgStaff)} /> : undefined}
          sub="staff experience"
        />
        <StatsCard
          label="Retention Rate"
          value={total ? `${churn.retentionRate}%` : "—"}
          sub={total ? `${churn.returned} of ${total} returned` : undefined}
          accent="#10b981"
          icon={<IconRetention />}
        />
        <StatsCard label="Return Visits" value={churn.returned} accent="#00ADDE" icon={<IconReturn />} />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Sentiment breakdown</h3>
        <SentimentBar slices={sentiment} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Customer retention</h3>
          <DonutChart
            segments={[
              { label: "Returned", value: churn.returned, color: "#10b981" },
              { label: "Did not return", value: churn.churned, color: "#E8174B" },
            ]}
            centerValue={total ? `${churn.retentionRate}%` : "—"}
            centerLabel="retained"
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">How customers found us</h3>
          <BarList rows={discoveryRows} />
        </div>
      </div>
    </div>
  );
}
