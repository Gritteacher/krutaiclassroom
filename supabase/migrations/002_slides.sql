create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  title text not null default '' check (char_length(title) <= 180),
  caption text not null default '' check (char_length(caption) <= 400),
  image_path text not null,
  link_url text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists slides_public_order_idx
  on public.slides (published, sort_order, created_at);

drop trigger if exists slides_set_updated_at on public.slides;
create trigger slides_set_updated_at
before update on public.slides
for each row execute function public.set_updated_at();

alter table public.slides enable row level security;

drop policy if exists "Public can view published slides" on public.slides;
create policy "Public can view published slides"
on public.slides for select
using (published = true or public.is_admin());

drop policy if exists "Admins can insert slides" on public.slides;
create policy "Admins can insert slides"
on public.slides for insert
with check (public.is_admin());

drop policy if exists "Admins can update slides" on public.slides;
create policy "Admins can update slides"
on public.slides for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete slides" on public.slides;
create policy "Admins can delete slides"
on public.slides for delete
using (public.is_admin());
