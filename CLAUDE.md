# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A mobile-first PWA for tracking monthly income and expenses (SGD), built with React 18 + Vite + Tailwind CSS v3 + Supabase (Google OAuth + Postgres). Deployed to Vercel.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build
npm run preview   # serve the build locally
```

There are no tests or linters. Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.local.example`); without them the app shows a Supabase config warning.

## Architecture

- **No router.** `src/App.jsx` owns an `activeTab` state and renders pages from `src/pages/` (Dashboard, Expenses, Split, Budget, Splurge, Settings) behind `BottomNav`. App-level flows (welcome-income modal, month-end rollover, streak/celebration toasts) are also orchestrated in `App.jsx`.
- **Data layer is hooks over Supabase.** Each hook in `src/hooks/` wraps a set of tables and exposes data + mutation functions that pages receive as props (no global store). `useFinanceData` is the aggregate for a given month: categories, income, income_sources, expenses (joined to categories). It seeds `DEFAULT_CATEGORIES` on a user's first load, and treats `income_sources` as optional so a missing table degrades gracefully. `useAuth` handles Supabase Google OAuth; `useUserStats` holds streaks/theme/PayNow; `useSplurge` and `useSplit` load lazily only when their tabs are active.
- **Month-keyed data.** A `monthKey` (`YYYY-MM`, helpers in `src/lib/utils.js`) drives all queries; income is stored per month. Month-end streak logic lives in `src/lib/streaks.js` and is applied via the `user_stats` table.
- **Pure logic lives in `src/lib/`** (safe-to-spend, weekly digest, splurge recommendations, streaks, split math) — keep business rules there, not in components.
- **Theming**: themes are CSS-variable sets defined in `src/lib/themes.js`, applied by `ThemeProvider`/`applyTheme`; components style with `var(--theme-*)` tokens and Tailwind. Persisted per user in `user_stats`.
- **Charts are hand-rolled** (e.g. the donut is a CSS `conic-gradient`), despite the README mentioning Recharts — it is not a dependency.

## Database

Schema lives in `supabase/schema.sql` with incremental changes in `migrations-v2.sql` / `migrations-v3.sql` / `migrations-v4-split.sql`; these are run manually in the Supabase SQL Editor (no migration tooling). Tables: `income`, `categories` (with `budget_limit`, `sort_order`), `expenses`, `income_sources`, `splurge_goals`, `splurge_contributions`, `user_stats`, `splits`, `split_participants`. All rows are user-scoped — new tables need RLS policies matching the existing ones.
