-- Shared board-paper annotations (H1 2026)
-- Run in the Supabase SQL editor, or via supabase db push.

create extension if not exists pgcrypto;

create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  doc_version text not null,
  section_id text not null,
  anchor jsonb not null,
  body text not null,
  author_name text not null,
  parent_id uuid references public.annotations(id) on delete cascade,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists annotations_doc_version_idx
  on public.annotations (doc_version, created_at);

create index if not exists annotations_section_idx
  on public.annotations (section_id);

alter table public.annotations enable row level security;

-- App access is gated by the board passphrase session on Next.js API routes.
-- Prefer SUPABASE_SERVICE_ROLE_KEY on the server (bypasses RLS).
-- Deny direct anon/authenticated client access by default.
drop policy if exists "annotations_deny_all" on public.annotations;
create policy "annotations_deny_all"
  on public.annotations
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Optional realtime for direct supabase client mode (ignore if already added)
do $$
begin
  alter publication supabase_realtime add table public.annotations;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
