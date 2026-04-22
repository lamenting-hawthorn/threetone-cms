-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Posts table
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default '',
  slug          text unique,
  excerpt       text,
  content       text,
  category      text,
  cover_image_url text,
  video_url     text,
  seo_title     text,
  seo_description text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  author_id     uuid references auth.users(id) on delete set null
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_at_idx on public.posts (published_at desc);

-- Row Level Security
alter table public.posts enable row level security;

-- Public: only see published posts
create policy "Public can view published posts"
  on public.posts for select
  using (status = 'published');

-- Authenticated users (admins) can do everything
create policy "Admins can manage all posts"
  on public.posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for blog images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Storage policy: public read
create policy "Blog images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Storage policy: authenticated upload
create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');
