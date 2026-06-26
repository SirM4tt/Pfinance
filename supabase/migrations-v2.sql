-- Pfinance Change Spec v2 — run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS income_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL,
  month text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their income sources" ON income_sources FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS splurge_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_amount numeric NOT NULL,
  target_date date NOT NULL,
  emoji text DEFAULT '🛍️',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS splurge_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES splurge_goals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  note text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE splurge_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE splurge_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their goals" ON splurge_goals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their contributions" ON splurge_contributions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
