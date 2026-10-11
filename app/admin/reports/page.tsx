import { createServerClient } from "@/lib/supabase/server";
import ReportsView from "@/components/admin/ReportsView";
import type { Review, ReturnVisit } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = createServerClient();
  const [{ data: reviews }, { data: returns }] = await Promise.all([
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("return_visits").select("*"),
  ]);

  return (
    <ReportsView
      reviews={(reviews ?? []) as Review[]}
      returns={(returns ?? []) as ReturnVisit[]}
      now={Date.now()}
    />
  );
}
