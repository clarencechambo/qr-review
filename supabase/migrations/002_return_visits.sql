-- Delta feedback from returning customers
CREATE TABLE return_visits (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number    TEXT NOT NULL,
  original_review UUID REFERENCES reviews (id),
  experience_note TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_return_visits_phone ON return_visits (phone_number);

ALTER TABLE return_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert" ON return_visits
  FOR INSERT TO anon
  WITH CHECK (true);
