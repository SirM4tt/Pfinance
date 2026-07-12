-- v4: Quick Log (Back Tap / iOS Shortcut expense logging)
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS quick_log_tokens (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quick_log_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their quick log token" ON quick_log_tokens;
CREATE POLICY "Users own their quick log token" ON quick_log_tokens FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
