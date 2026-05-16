-- Reviews submitted by first-time customers
CREATE TABLE reviews (
  id                UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number      TEXT    NOT NULL,
  discovery_channel TEXT    NOT NULL,
  discovery_other   TEXT,
  price_rating      INTEGER NOT NULL CHECK (price_rating BETWEEN 1 AND 5),
  purchase_reason   TEXT    NOT NULL,
  staff_rating      INTEGER NOT NULL CHECK (staff_rating BETWEEN 1 AND 5),
  staff_feedback    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- One first-time review per phone number
CREATE UNIQUE INDEX idx_reviews_phone ON reviews (phone_number);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Customers may only insert their own review; reads are blocked for anon
CREATE POLICY "allow_anon_insert" ON reviews
  FOR INSERT TO anon
  WITH CHECK (true);
