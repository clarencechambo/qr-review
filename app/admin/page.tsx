import { createServerClient } from "@/lib/supabase/server";
import StatsCard from "@/components/admin/StatsCard";
import BarList from "@/components/admin/charts/BarList";
import DonutChart from "@/components/admin/charts/DonutChart";
import {
  IconReviews,
  IconReturn,
  IconRetention,
  IconStaff,
  IconPrice,
} from "@/components/admin/icons";
import { retentionStats } from "@/lib/analytics";
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

  const avgPrice = total
    ? (reviews.reduce((s, r) => s + r.price_rating, 0) / total).toFixed(1)
    : "—";
  const avgStaff = total
    ? (reviews.reduce((s, r) => s + r.staff_rating, 0) / total).toFixed(1)
    : "—";

  const churn = retentionStats(reviews, returns);

  const discoveryRows = DISCOVERY_OPTIONS.map((opt) => ({
    label: opt,
    value: reviews.filter((r) => r.discovery_channel === opt).length,
    color: "#00ADDE",
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard label="Total Reviews" value={total} accent="#E8174B" icon={<IconReviews />} />
        <StatsCard label="Return Visits" value={churn.returned} accent="#00ADDE" icon={<IconReturn />} />
        <StatsCard
          label="Retention Rate"
          value={total ? `${churn.retentionRate}%` : "—"}
          sub={total ? `${churn.returned} of ${total} returned` : undefined}
          accent="#10b981"
          icon={<IconRetention />}
        />
        <StatsCard label="Avg Staff Rating" value={avgStaff} sub="out of 5" accent="#f59e0b" icon={<IconStaff />} />
        <StatsCard label="Avg Price Rating" value={avgPrice} sub="out of 5" accent="#00ADDE" icon={<IconPrice />} />
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
