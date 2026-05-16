import { createServerClient } from "@/lib/supabase/server";
import StatsCard from "@/components/admin/StatsCard";
import DiscoveryChart from "@/components/admin/DiscoveryChart";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createServerClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: returnVisits } = await supabase
    .from("return_visits")
    .select("id");

  const all: Review[] = reviews ?? [];
  const total = all.length;
  const avgPrice = total
    ? (all.reduce((s, r) => s + r.price_rating, 0) / total).toFixed(1)
    : "—";
  const avgStaff = total
    ? (all.reduce((s, r) => s + r.staff_rating, 0) / total).toFixed(1)
    : "—";
  const returnCount = returnVisits?.length ?? 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Reviews" value={total} />
        <StatsCard label="Return Visits" value={returnCount} />
        <StatsCard label="Avg Price Rating" value={avgPrice} sub="out of 5" />
        <StatsCard label="Avg Staff Rating" value={avgStaff} sub="out of 5" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">How customers found us</h3>
        <DiscoveryChart reviews={all} />
      </div>
    </div>
  );
}
