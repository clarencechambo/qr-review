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
      <h2 className="text-2xl font-bold">All Responses</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <ResponsesTable reviews={(reviews ?? []) as Review[]} />
      </div>
    </div>
  );
}
