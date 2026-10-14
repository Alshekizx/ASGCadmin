begin;

create table public.asgc_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.asgc_admins enable row level security;
create policy "Admins see their membership" on public.asgc_admins for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.asgc_admins from anon, authenticated;
grant select on public.asgc_admins to authenticated;

create function public.asgc_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.asgc_admins where user_id = auth.uid());
$$;
revoke all on function public.asgc_is_admin() from public;
grant execute on function public.asgc_is_admin() to anon, authenticated;

create table public.asgc_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('news','publication','photo','video','press','speech','coverage')),
  slug text not null check (length(slug) between 1 and 200),
  title text not null check (length(title) between 1 and 500),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 200000),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(kind,slug)
);
alter table public.asgc_content enable row level security;
create policy "Public reads published content" on public.asgc_content for select to anon, authenticated using (status = 'published' or public.asgc_is_admin());
create policy "Admins insert content" on public.asgc_content for insert to authenticated with check (public.asgc_is_admin());
create policy "Admins update content" on public.asgc_content for update to authenticated using (public.asgc_is_admin()) with check (public.asgc_is_admin());
create policy "Admins delete content" on public.asgc_content for delete to authenticated using (public.asgc_is_admin());
revoke all on public.asgc_content from anon, authenticated;
grant select on public.asgc_content to anon;
grant select, insert, update, delete on public.asgc_content to authenticated;

create function public.asgc_submission_strings(value jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select not exists (
    select 1 from jsonb_each(value) as fields where jsonb_typeof(fields.value) <> 'string'
  );
$$;

create table public.asgc_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact','partnership','newsletter')),
  data jsonb not null check (jsonb_typeof(data) = 'object' and public.asgc_submission_strings(data) and data ? 'email' and jsonb_typeof(data->'email') = 'string' and octet_length(data::text) <= 20000 and length(data->>'email') between 3 and 320 and data->>'email' like '%@%'),
  status text not null default 'unread' check (status in ('unread','read','archived','confirmed','cancelled','active','unsubscribed')),
  created_at timestamptz not null default now()
);
alter table public.asgc_submissions enable row level security;
create policy "Visitors submit forms" on public.asgc_submissions for insert to anon, authenticated with check (status = 'unread');
create policy "Only admins read submissions" on public.asgc_submissions for select to authenticated using (public.asgc_is_admin());
create policy "Only admins update submissions" on public.asgc_submissions for update to authenticated using (public.asgc_is_admin()) with check (public.asgc_is_admin());
create policy "Only admins delete submissions" on public.asgc_submissions for delete to authenticated using (public.asgc_is_admin());
revoke all on public.asgc_submissions from anon, authenticated;
grant insert(kind,data) on public.asgc_submissions to anon;
grant select, insert, update, delete on public.asgc_submissions to authenticated;

-- Published website assets; uploads and deletions require an approved admin account.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('asgc-assets','asgc-assets',true,10485760,array['image/png','image/jpeg','image/webp','application/pdf']) on conflict (id) do nothing;
create policy "ASGC admins upload assets" on storage.objects for insert to authenticated with check (bucket_id = 'asgc-assets' and public.asgc_is_admin());
create policy "ASGC admins manage assets" on storage.objects for select to authenticated using (bucket_id = 'asgc-assets' and public.asgc_is_admin());
create policy "ASGC admins delete assets" on storage.objects for delete to authenticated using (bucket_id = 'asgc-assets' and public.asgc_is_admin());

-- Realtime notifications are filtered by the same row-level permissions.
alter publication supabase_realtime add table public.asgc_content, public.asgc_submissions;
commit;
