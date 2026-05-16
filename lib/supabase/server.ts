import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key.
// Never import this in client components or files with "use client".
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
