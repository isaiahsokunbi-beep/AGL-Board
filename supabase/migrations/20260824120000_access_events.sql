-- Access events: who unlocked the board paper (viewer name + metadata).
-- Optional; the app also persists to a local/tmp JSON file by default.
-- Run in the Supabase SQL editor if you want durable multi-instance logs.

create table if not exists public.access_events (
  id uuid primary key default gen_random_uuid(),
  viewer_name text not null,
  accessed_at timestamptz not null default now(),
  ip text,
  user_agent text,
  path text not null default '/'
);

create index if not exists access_events_accessed_at_idx
  on public.access_events (accessed_at desc);

alter table public.access_events enable row level security;

drop policy if exists "access_events_deny_all" on public.access_events;
create policy "access_events_deny_all"
  on public.access_events
  for all
  to anon, authenticated
  using (false)
  with check (false);
