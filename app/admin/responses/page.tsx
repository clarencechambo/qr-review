import { createServerClient } from "@/lib/supabase/server";
import ResponsesTable from "@/components/admin/ResponsesTable";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
  const supabase = createServerClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">All Responses</h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <ResponsesTable reviews={(reviews ?? []) as Review[]} />
      </div>
    </div>
  );
}
