-- Pfinance Spec v3 — run in Supabase SQL Editor
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS

ALTER TABLE categories ADD COLUMN IF NOT EXISTS last_month_spent numeric DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  best_month text,
  last_checked_month text,
  last_digest_shown date,
  celebration_count integer DEFAULT 0,
  theme_id text DEFAULT 'navy',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their stats" ON user_stats;
CREATE POLICY "Users own their stats" ON user_stats FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
