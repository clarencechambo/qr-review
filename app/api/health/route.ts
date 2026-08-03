import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Lightweight health check that also touches Supabase, so a scheduled ping to
// this route keeps the free-tier project active (it pauses after ~7 days idle).
export async function GET() {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("reviews").select("id").limit(1);
    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
