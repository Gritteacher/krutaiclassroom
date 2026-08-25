-- ห้องเรียนครูไต๋: privacy-friendly visit counter
-- Counts one visit per browser session in the website code and stores no personal data.

create table if not exists public.site_stats (
  key text primary key check (key = 'visits'),
  value bigint not null default 0 check (value >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_stats (key, value)
values ('visits', 0)
on conflict (key) do nothing;

alter table public.site_stats enable row level security;

-- The table is not exposed directly. Visitors can only use these two functions.
create or replace function public.record_visit()
returns bigint
language sql
volatile
security definer
set search_path = public
as $$
  update public.site_stats
  set value = value + 1,
      updated_at = now()
  where key = 'visits'
  returning value;
$$;

create or replace function public.get_visit_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select value
  from public.site_stats
  where key = 'visits';
$$;

revoke all on table public.site_stats from anon, authenticated;
revoke all on function public.record_visit() from public;
revoke all on function public.get_visit_count() from public;
grant execute on function public.record_visit() to anon, authenticated;
grant execute on function public.get_visit_count() to anon, authenticated;
