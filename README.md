# Finance Tracker

A mobile-first PWA for tracking monthly income and expenses, with charts, category breakdowns, and budget progress. Built with React + Vite + Supabase.

## Features

- Google OAuth sign-in via Supabase
- Monthly income tracking (SGD)
- Add / delete expenses with categories
- Donut chart spending breakdown (Recharts)
- Per-category budget limits and progress bars
- Installable PWA for offline-capable mobile use

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) named `finance-tracker`
2. Run `supabase/schema.sql` in the **SQL Editor**
3. Enable **Google** under Authentication → Providers
4. Copy your project URL and anon key from Settings → API

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
npm run build
npx vercel
```

Add environment variables in Vercel, then update Supabase **Authentication → URL Configuration**:

- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

## PWA icons

Replace `public/icons/icon.svg` with proper `icon-192.png` and `icon-512.png` for production. The SVG works as a favicon for development.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Backend | Supabase (auth + PostgreSQL) |
| PWA | vite-plugin-pwa |
