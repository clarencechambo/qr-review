import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { submitReviewSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = submitReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const baseRow = {
    phone_number: parsed.data.phone_number,
    discovery_channel: parsed.data.discovery_channel,
    discovery_other: parsed.data.discovery_other ?? null,
    price_rating: parsed.data.price_rating,
    purchase_reason: parsed.data.purchase_reason,
    staff_rating: parsed.data.staff_rating,
    staff_feedback: parsed.data.staff_feedback ?? null,
  };

  let { error } = await supabase
    .from("reviews")
    .insert({ ...baseRow, name: parsed.data.name });

  // Graceful fallback: if the `name` column hasn't been added to the table yet
  // (Postgres 42703 = undefined_column), save the review without it so
  // submissions keep working. Names persist automatically once the column exists.
  if (error && error.code === "42703") {
    ({ error } = await supabase.from("reviews").insert(baseRow));
  }

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A review for this number already exists" },
        { status: 409 }
      );
    }
    console.error("submit-review insert error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
