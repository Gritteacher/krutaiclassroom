-- ห้องเรียนครูไต๋: Database, Auth authorization and Storage policies
-- Run this whole file once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  url text not null default '',
  category text not null default 'เว็บไซต์',
  icon text not null default 'browser'
    check (icon in ('browser', 'users', 'shirt', 'sparkle')),
  color text not null default '#176b4c'
    check (color ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (char_length(slug) between 1 and 180),
  title text not null check (char_length(title) between 1 and 220),
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'บันทึกของครู',
  cover_path text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (published, sort_order, created_at);

create index if not exists posts_public_date_idx
  on public.posts (published, published_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Automatically grant admin access only to the owner's email.
create or replace function public.register_krutaiclassroom_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'gritsana.th@gmail.com' then
    insert into public.app_admins (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists register_krutaiclassroom_admin on auth.users;
create trigger register_krutaiclassroom_admin
after insert or update of email on auth.users
for each row execute function public.register_krutaiclassroom_admin();

-- Covers the case where the admin account was created before this migration.
insert into public.app_admins (user_id)
select id from auth.users
where lower(email) = 'gritsana.th@gmail.com'
on conflict (user_id) do nothing;

alter table public.app_admins enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;

drop policy if exists "admins read own membership" on public.app_admins;
create policy "admins read own membership"
on public.app_admins for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
on public.projects for select
to anon, authenticated
using (published or public.is_admin());

drop policy if exists "admins insert projects" on public.projects;
create policy "admins insert projects"
on public.projects for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins update projects" on public.projects;
create policy "admins update projects"
on public.projects for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete projects" on public.projects;
create policy "admins delete projects"
on public.projects for delete
to authenticated
using (public.is_admin());

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
on public.posts for select
to anon, authenticated
using (published or public.is_admin());

drop policy if exists "admins insert posts" on public.posts;
create policy "admins insert posts"
on public.posts for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins update posts" on public.posts;
create policy "admins update posts"
on public.posts for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete posts" on public.posts;
create policy "admins delete posts"
on public.posts for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads post images" on storage.objects;
create policy "public reads post images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'post-images');

drop policy if exists "admins upload post images" on storage.objects;
create policy "admins upload post images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "admins update post images" on storage.objects;
create policy "admins update post images"
on storage.objects for update
to authenticated
using (bucket_id = 'post-images' and public.is_admin())
with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "admins delete post images" on storage.objects;
create policy "admins delete post images"
on storage.objects for delete
to authenticated
using (bucket_id = 'post-images' and public.is_admin());

-- Initial website cards.
insert into public.projects
  (title, description, url, category, icon, color, sort_order, published)
select *
from (
  values
    ('ระบบเลือกตั้งประธานคณะสี', 'เลือกตั้งออนไลน์ที่ใช้งานง่าย โปร่งใส และตรวจสอบสถิติได้', 'https://vote26.grits.online/', 'กิจกรรมนักเรียน', 'users', '#176b4c', 1, true),
    ('ระบบกรอกไซซ์เสื้อกีฬา', 'บันทึกและตรวจสอบไซซ์เสื้อของครูและนักเรียนได้ในที่เดียว', 'https://dsnsize.grits.online', 'ระบบโรงเรียน', 'shirt', '#d49b00', 2, true),
    ('ระบบตรวจความสะอาด', 'ช่วยบันทึกคะแนน เหตุผล และสรุปผลการตรวจประจำวัน', '', 'ระบบโรงเรียน', 'sparkle', '#3b8f78', 3, true),
    ('สื่อการเรียนรู้เศรษฐศาสตร์', 'คลังเนื้อหา แบบฝึกหัด และกิจกรรมสำหรับห้องเรียน', '', 'การเรียนรู้', 'browser', '#176b4c', 4, true)
) as seed(title, description, url, category, icon, color, sort_order, published)
where not exists (select 1 from public.projects);

-- Initial journal entries.
insert into public.posts
  (slug, title, excerpt, content, category, published, published_at)
select *
from (
  values
    (
      'welcome-to-krutaiclassroom',
      'ยินดีต้อนรับสู่ห้องเรียนครูไต๋',
      'พื้นที่ใหม่ที่รวบรวมเว็บไซต์ ผลงาน และเรื่องราวจากห้องเรียนไว้ด้วยกัน',
      E'ยินดีต้อนรับสู่ “ห้องเรียนครูไต๋”\n\nเว็บไซต์นี้เกิดขึ้นจากความตั้งใจที่จะรวบรวมระบบต่าง ๆ ที่สร้างขึ้นเพื่อโรงเรียน สื่อการเรียนรู้ และเรื่องราวจากประสบการณ์ทำงานไว้ในพื้นที่เดียว\n\nหวังว่าพื้นที่เล็ก ๆ แห่งนี้จะช่วยให้ทุกคนค้นหาสิ่งที่ต้องการได้ง่ายขึ้น และได้แลกเปลี่ยนเรียนรู้ไปด้วยกัน',
      'บันทึกของครู',
      true,
      '2026-07-23T08:00:00.000Z'::timestamptz
    ),
    (
      'digital-tools-for-school',
      'เมื่อเทคโนโลยีช่วยให้งานโรงเรียนง่ายขึ้น',
      'แนวคิดเบื้องหลังการสร้างระบบเล็ก ๆ เพื่อแก้ปัญหาในชีวิตประจำวัน',
      E'หลายครั้งปัญหาในโรงเรียนไม่ได้ต้องการระบบที่ซับซ้อน แต่ต้องการเครื่องมือที่เข้าใจบริบทจริง\n\nจุดเริ่มต้นของแต่ละเว็บไซต์จึงมาจากคำถามง่าย ๆ ว่า เราจะลดงานซ้ำ ลดความคลาดเคลื่อน และทำให้ทุกคนใช้งานได้สะดวกขึ้นอย่างไร',
      'เทคโนโลยีการศึกษา',
      true,
      '2026-07-20T08:00:00.000Z'::timestamptz
    ),
    (
      'learning-beyond-classroom',
      'การเรียนรู้เกิดขึ้นได้ทุกที่',
      'ห้องเรียนที่ดีอาจไม่จำเป็นต้องถูกจำกัดไว้ด้วยโต๊ะ กระดาน หรือสี่ผนัง',
      E'การเรียนรู้เกิดขึ้นได้ทั้งจากบทเรียน กิจกรรม การลงมือทำ และการพูดคุยแลกเปลี่ยน\n\nบทบาทของครูจึงไม่ใช่เพียงผู้ส่งต่อความรู้ แต่คือคนที่ออกแบบพื้นที่ให้ผู้เรียนกล้าคิด กล้าถาม และค้นพบคำตอบด้วยตนเอง',
      'การเรียนรู้',
      true,
      '2026-07-18T08:00:00.000Z'::timestamptz
    )
) as seed(slug, title, excerpt, content, category, published, published_at)
where not exists (select 1 from public.posts);
