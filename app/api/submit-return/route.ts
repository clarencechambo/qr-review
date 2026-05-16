import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { submitReturnSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = submitReturnSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Look up the original review to link to it
  const { data: original } = await supabase
    .from("reviews")
    .select("id")
    .eq("phone_number", parsed.data.phone_number)
    .maybeSingle();

  const { error } = await supabase.from("return_visits").insert({
    phone_number: parsed.data.phone_number,
    original_review: original?.id ?? null,
    experience_note: parsed.data.experience_note,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
