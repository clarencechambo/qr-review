import { createServerClient } from "@/lib/supabase/server";
import StatsCard from "@/components/admin/StatsCard";
import AtRiskTable from "@/components/admin/AtRiskTable";
import BarList from "@/components/admin/charts/BarList";
import DonutChart from "@/components/admin/charts/DonutChart";
import TrendChart from "@/components/admin/charts/TrendChart";
import SentimentBar from "@/components/admin/SentimentBar";
import { IconChurn, IconRetention, IconReviews } from "@/components/admin/icons";
import {
  retentionStats,
  atRiskCustomers,
  channelRetention,
  ratingDistribution,
  reviewsOverTime,
  sentimentDistribution,
} from "@/lib/analytics";
import type { Review, ReturnVisit } from "@/lib/types";

export const dynamic = "force-dynamic";

const PRICE_LABELS: Record<number, string> = {
  1: "Much cheaper",
  2: "A bit cheaper",
  3: "About the same",
  4: "A bit pricier",
  5: "Much pricier",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = createServerClient();
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: returnsData } = await supabase.from("return_visits").select("*");

  const reviews: Review[] = reviewsData ?? [];
  const returns: ReturnVisit[] = returnsData ?? [];

  const churn = retentionStats(reviews, returns);
  const atRisk = atRiskCustomers(reviews);
  const channels = channelRetention(reviews, returns);
  const sentiment = sentimentDistribution(reviews);
  const priceDist = ratingDistribution(reviews, "price_rating");
  const trend = reviewsOverTime(reviews);

  const negativeFeedback = reviews.filter((r) => r.staff_feedback && r.staff_feedback.trim());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics &amp; Churn</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track retention, spot at-risk customers, and see what's driving performance.
        </p>
      </div>

      {/* Churn KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Customers" value={churn.totalCustomers} accent="#00ADDE" icon={<IconReviews />} />
        <StatsCard label="Returned" value={churn.returned} accent="#10b981" icon={<IconRetention />} />
        <StatsCard
          label="Retention Rate"
          value={churn.totalCustomers ? `${churn.retentionRate}%` : "—"}
          accent="#10b981"
          icon={<IconRetention />}
        />
        <StatsCard
          label="Churn Rate"
          value={churn.totalCustomers ? `${churn.churnRate}%` : "—"}
          sub={`${churn.churned} did not return`}
          accent="#E8174B"
          icon={<IconChurn />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Retention vs. churn">
          <DonutChart
            segments={[
              { label: "Returned", value: churn.returned, color: "#10b981" },
              { label: "Did not return", value: churn.churned, color: "#E8174B" },
            ]}
            centerValue={churn.totalCustomers ? `${churn.retentionRate}%` : "—"}
            centerLabel="retained"
          />
          <p className="text-xs text-gray-400 mt-4">
            &ldquo;Returned&rdquo; counts customers who re-scanned the QR and filled the return-visit
            form — a re-engagement signal, not total footfall.
          </p>
        </Card>

        <Card title="Return rate by channel">
          <BarList
            max={100}
            rows={channels.map((c) => ({
              label: c.channel,
              value: c.returnRate,
              display: `${c.returnRate}%`,
              color: "#00ADDE",
            }))}
            emptyMessage="No reviews yet."
          />
          <p className="text-xs text-gray-400 mt-4">
            Which acquisition channels bring customers who come back.
          </p>
        </Card>
      </div>

      {/* At-risk customers */}
      <Card title={`At-risk customers (${atRisk.length})`}>
        <AtRiskTable customers={atRisk} />
      </Card>

      {/* Trend */}
      <Card title="Reviews over time (last 8 weeks)">
        <TrendChart data={trend} />
      </Card>

      {/* Distributions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Staff sentiment">
          <SentimentBar slices={sentiment} />
        </Card>
        <Card title="Price perception">
          <BarList
            rows={priceDist.map((d) => ({
              label: PRICE_LABELS[d.rating],
              value: d.count,
              color: d.rating >= 4 ? "#ef4444" : d.rating === 3 ? "#f59e0b" : "#10b981",
            }))}
          />
        </Card>
      </div>

      {/* Negative feedback */}
      <Card title={`Recent negative feedback (${negativeFeedback.length})`}>
        {negativeFeedback.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No negative feedback yet.</p>
        ) : (
          <ul className="space-y-3">
            {negativeFeedback.slice(0, 15).map((r) => (
              <li key={r.id} className="border-l-2 pl-3" style={{ borderColor: "#E8174B" }}>
                <p className="text-sm text-gray-800 italic">&ldquo;{r.staff_feedback}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.staff_rating}★ staff · {new Date(r.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
