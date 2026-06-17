-- Grant table privileges to the Supabase roles.
--
-- The earlier migrations enabled RLS and added policies, but never GRANTed
-- table privileges. service_role bypasses RLS but NOT table-level GRANTs, so
-- every server-side insert failed with "permission denied for table" (42501).
-- These grants fix reads (admin, via service_role) and writes (review submissions).

GRANT SELECT, INSERT ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON TABLE public.return_visits TO anon, authenticated, service_role;
