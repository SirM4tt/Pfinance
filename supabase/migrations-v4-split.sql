-- Pfinance Split feature — run in Supabase SQL Editor
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS

CREATE TABLE IF NOT EXISTS splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  total_amount numeric NOT NULL,
  tip_percent numeric NOT NULL DEFAULT 0,
  payer_name text NOT NULL DEFAULT 'You',
  date date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  expense_id uuid REFERENCES expenses(id) ON DELETE SET NULL,
  settled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS split_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id uuid REFERENCES splits(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount_owed numeric NOT NULL DEFAULT 0,
  is_payer boolean NOT NULL DEFAULT false,
  settled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS splits_user_id_idx ON splits(user_id);
CREATE INDEX IF NOT EXISTS split_participants_split_id_idx ON split_participants(split_id);

ALTER TABLE splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their splits" ON splits;
CREATE POLICY "Users own their splits" ON splits FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their split participants" ON split_participants;
CREATE POLICY "Users own their split participants" ON split_participants FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PayNow hint for share messages (optional)
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS paynow_id text;
