# Threetone CMS — Setup Guide

## Prerequisites

- Node.js 18+
- A Supabase project (project ref: `hdggjmpphsmgjqdjxvcr`)

---

## 1. Environment variables

Copy the example files and fill in your Supabase credentials:

```bash
cp apps/admin/.env.local.example apps/admin/.env.local
cp apps/web/.env.local.example   apps/web/.env.local
```

Get these values from your [Supabase dashboard](https://supabase.com/dashboard/project/hdggjmpphsmgjqdjxvcr/settings/api):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role secret key |

Set `NEXT_PUBLIC_WEB_URL=http://localhost:3000` in admin's `.env.local` for local preview links.

---

## 2. Run the database migrations

Go to the [SQL Editor](https://supabase.com/dashboard/project/hdggjmpphsmgjqdjxvcr/sql) and run:

1. `supabase/migrations/001_posts.sql`

Or use the Supabase CLI:

```bash
supabase db push
```

---

## 3. Create an admin user

In the [Supabase Auth dashboard](https://supabase.com/dashboard/project/hdggjmpphsmgjqdjxvcr/auth/users), click **Add user** and create your admin account.

---

## 4. Install dependencies

```bash
npm install
```

---

## 5. Start development servers

```bash
# Both apps at once
npm run dev

# Or individually
npm run dev:web    # http://localhost:3000
npm run dev:admin  # http://localhost:3001
```

---

## Usage

| URL | What it is |
|---|---|
| `http://localhost:3001` | CMS admin (login required) |
| `http://localhost:3001/dashboard` | Post list |
| `http://localhost:3001/dashboard/posts/new` | New post |
| `http://localhost:3000/blog` | Public blog |
| `http://localhost:3000/blog/[slug]` | Individual post |

### Workflow

1. Log in to the admin at `:3001`
2. Create a post — it autosaves as a draft every 3 seconds
3. Click **Preview** to see it rendered on the web app before publishing
4. Click **Publish** to make it live on the public blog
5. Edit any published post — changes go live on next save

---

## Folder structure

```
cms/
├── apps/
│   ├── web/         → Public site (Next.js, port 3000)
│   └── admin/       → CMS dashboard (Next.js, port 3001)
├── packages/
│   └── db/          → Shared Supabase client + queries + types
├── supabase/
│   └── migrations/  → SQL migration files
├── turbo.json
└── package.json     → npm workspaces root
```
