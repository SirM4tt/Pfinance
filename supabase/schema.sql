-- Run this in Supabase SQL Editor (finance-tracker project)

-- Monthly income per user
CREATE TABLE income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  month text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Expense categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#818cf8',
  icon text NOT NULL DEFAULT '💳',
  budget_limit numeric DEFAULT NULL
);

-- Expenses
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their income" ON income FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their categories" ON categories FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their expenses" ON expenses FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
