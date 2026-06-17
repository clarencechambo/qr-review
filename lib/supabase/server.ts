import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-only client using the service role key.
// Never import this in client components or files with "use client".
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Cookie-aware client for reading the logged-in admin's session in Server
// Components (uses the anon key + the @supabase/ssr cookie format).
export async function createServerAuthClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't set cookies; safe to ignore. Session
          // refresh happens client-side / in middleware.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* no-op in Server Components */
          }
        },
      },
    }
  );
}
