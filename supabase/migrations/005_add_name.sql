-- Store the customer's name alongside their phone number.
-- The app collects the name in the first step (PhoneStep) and the submit-review
-- API saves it. Until this column exists the API silently drops the name
-- (graceful fallback), so run this to start persisting names.

alter table public.reviews add column if not exists name text;
