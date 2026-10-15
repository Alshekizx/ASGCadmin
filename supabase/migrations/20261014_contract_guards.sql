-- Single authoritative settings record and founder profile for public rendering.
create unique index if not exists asgc_one_published_settings on public.asgc_content(kind) where kind='settings' and status='published';
create unique index if not exists asgc_one_published_founder on public.asgc_content(kind) where kind='leadership' and status='published' and data->>'founder'='true';
