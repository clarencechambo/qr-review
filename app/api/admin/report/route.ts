import { NextRequest, NextResponse } from "next/server";
import { createServerAuthClient, createServerClient } from "@/lib/supabase/server";
import { reportQuerySchema } from "@/lib/validation";
import { buildComplaintReport, periodFromKey, previousPeriod } from "@/lib/report";
import { buildComplaintWorkbook } from "@/lib/report-xlsx";
import type { Review, ReturnVisit } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/admin/report?type=week|month&start=YYYY-MM-DD → complaint report .xlsx
export async function GET(req: NextRequest) {
  // The workbook contains customer names and phone numbers — admins only.
  const auth = await createServerAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = reportQuerySchema.safeParse({
    type: req.nextUrl.searchParams.get("type"),
    start: req.nextUrl.searchParams.get("start"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid report period" },
      { status: 400 }
    );
  }
  const period = periodFromKey(parsed.data.type, parsed.data.start);
  if (!period) {
    return NextResponse.json({ error: "Invalid report period" }, { status: 400 });
  }

  // Fetch the previous period too, for the comparison column.
  const from = new Date(previousPeriod(period).start).toISOString();
  const to = new Date(period.end).toISOString();
  const supabase = createServerClient();
  const [reviewsRes, returnsRes] = await Promise.all([
    supabase.from("reviews").select("*").gte("created_at", from).lt("created_at", to),
    supabase.from("return_visits").select("*").gte("created_at", from).lt("created_at", to),
  ]);
  if (reviewsRes.error || returnsRes.error) {
    console.error("report fetch error:", reviewsRes.error ?? returnsRes.error);
    return NextResponse.json({ error: "Failed to load report data" }, { status: 500 });
  }

  const report = buildComplaintReport(
    (reviewsRes.data ?? []) as Review[],
    (returnsRes.data ?? []) as ReturnVisit[],
    period
  );
  const buffer = await buildComplaintWorkbook(report);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="DCL-complaints-${period.type}-${period.key}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
