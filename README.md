# Threetone CMS

Blog CMS for [Threetone](https://threetone.in) — a Turborepo monorepo with separate admin dashboard and public blog, backed by Supabase.

## Architecture

```
cms/
├── apps/
│   ├── web/         → Public blog (Next.js, port 3000)
│   └── admin/       → CMS dashboard (Next.js, port 3001)
├── packages/
│   └── db/          → Shared Supabase client, queries, and types
├── supabase/
│   └── migrations/  → SQL migration files
├── .github/
│   └── workflows/   → CI (typecheck, lint, build)
├── turbo.json       → Turborepo task config
└── package.json     → npm workspace root
```

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Database / Auth / Storage | Supabase |
| Rich text editor | TipTap |
| Styling | Tailwind CSS 3 |
| Monorepo | Turborepo + npm workspaces |
| CI | GitHub Actions |

## Prerequisites

- **Node.js** 18+
- **A Supabase project** — [create one free](https://supabase.com)
- **GitHub account** (for CI + Vercel deploy)

---

## Quick start (local dev)

### 1. Clone and install

```bash
git clone https://github.com/lamenting-hawthorn/threetone-cms.git
cd threetone-cms
npm install
```

### 2. Set environment variables

```bash
cp apps/admin/.env.local.example apps/admin/.env.local
cp apps/web/.env.local.example   apps/web/.env.local
```

Fill in both `.env.local` files with values from your [Supabase dashboard](https://supabase.com/dashboard):

| Variable | App | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Both | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Both | Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Both | Project Settings → API → service_role secret |
| `NEXT_PUBLIC_WEB_URL` | Admin only | `http://localhost:3000` (or your web app URL) |
| `PREVIEW_SECRET` | Both | A random string you choose (e.g. `openssl rand -hex 16`) |
| `NEXT_PUBLIC_PREVIEW_SECRET` | Admin only | Same value as `PREVIEW_SECRET` |
| `REVALIDATE_SECRET` | Both | Another random string |

### 3. Run database migration

Open your Supabase project's [SQL Editor](https://supabase.com/dashboard) and run:

```
supabase/migrations/001_posts.sql
```

This creates the `posts` table, RLS policies, and the `blog-images` storage bucket.

### 4. Create an admin user

In the [Supabase Auth dashboard](https://supabase.com/dashboard), go to **Authentication → Users** and click **Add user** with an email + password.

### 5. Start dev servers

```bash
# Both apps at once
npm run dev

# Or individually
npm run dev:web    # http://localhost:3000
npm run dev:admin  # http://localhost:3001
```

---

## Deploy to Vercel

Deploy each app as a **separate Vercel project** from the same repo. Both use Turborepo-aware build commands — Vercel automatically detects the `vercel.json` in `apps/admin/` and the Next.js config in `apps/web/`.

### Admin app

1. Create a new Vercel project pointing to this repo.
2. Set **Root Directory** to `apps/admin`.
3. Add these environment variables:

| Variable |
|---|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `NEXT_PUBLIC_WEB_URL` (your web app's production URL) |
| `NEXT_PUBLIC_PREVIEW_SECRET` |
| `NEXT_PUBLIC_REVALIDATE_SECRET` |

4. Deploy. The `vercel.json` already specifies the correct `buildCommand` and `installCommand` for the monorepo.

### Web app

1. Create a **separate** Vercel project (same repo).
2. Set **Root Directory** to `apps/web`.
3. Add these environment variables:

| Variable |
|---|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `PREVIEW_SECRET` |
| `REVALIDATE_SECRET` |

4. Deploy. No `vercel.json` is needed — Vercel auto-detects Next.js.

> **Important**: Use the **same** `PREVIEW_SECRET` and `REVALIDATE_SECRET` values across both apps so preview tokens and cache revalidation work.

### GitHub Actions CI secrets

Add these to your GitHub repo **Settings → Secrets and variables → Actions**:

| Secret |
|---|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |

---

## Usage

| URL | What |
|-----|------|
| `admin.yourdomain.com/login` | Admin login |
| `admin.yourdomain.com/dashboard` | Post list |
| `admin.yourdomain.com/dashboard/posts/new` | New post |
| `yourdomain.com/blog` | Public blog listing |
| `yourdomain.com/blog/[slug]` | Individual post |

### Workflow

1. Log into the admin dashboard.
2. Click **New post** — content autosaves every 3 seconds.
3. Preview the post with the **Preview** button (opens the web app with a secure token).
4. Click **Publish** to make the post live.
5. Editing a published post pushes changes live on save. Published posts revalidate the blog cache immediately.

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start both apps in dev mode |
| `npm run dev:web` | Start only the public blog |
| `npm run dev:admin` | Start only the admin dashboard |
| `npm run build` | Build both apps for production |
| `npm run lint` | Run ESLint across all packages |
| `npm run typecheck` | Run TypeScript type checking across all packages |

---

## Database

The `posts` table stores everything. Row Level Security ensures:

- **Public users** can only read `status = 'published'` posts.
- **Authenticated users** (admins) can create, update, and delete any post.

Blog images are stored in a `blog-images` Supabase Storage bucket — publicly readable, writable only by authenticated users.

---

## CI

On every push to `main` and every pull request, GitHub Actions runs:

```
typecheck → lint → build (parallel)
```

The build job needs Supabase secrets set in your GitHub repo settings.
