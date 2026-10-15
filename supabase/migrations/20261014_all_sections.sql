begin;
alter table public.asgc_content drop constraint asgc_content_kind_check;
alter table public.asgc_content add constraint asgc_content_kind_check check (kind in ('news','publication','photo','video','press','speech','coverage','event','programme','leadership','partner','page','settings'));
alter table public.asgc_submissions drop constraint asgc_submissions_kind_check;
alter table public.asgc_submissions add constraint asgc_submissions_kind_check check (kind in ('contact','partnership','newsletter','registration'));
alter table public.asgc_admins add column active boolean not null default true;
alter table public.asgc_admins add column display_name text not null default '';
create or replace function public.asgc_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.asgc_admins where user_id=auth.uid() and active);
$$;
create function public.asgc_list_users() returns table(user_id uuid,email text,display_name text,active boolean,approved boolean,created_at timestamptz,last_sign_in_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
 if not public.asgc_is_admin() then raise exception 'Administrator access required' using errcode='42501'; end if;
 return query select u.id,u.email::text,coalesce(nullif(a.display_name,''),u.raw_user_meta_data->>'display_name',''),coalesce(a.active,false),a.user_id is not null,u.created_at,u.last_sign_in_at from auth.users u left join public.asgc_admins a on a.user_id=u.id order by u.created_at;
end; $$;
create function public.asgc_manage_user(target_email text, target_name text, enabled boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare target uuid;
begin
 if not public.asgc_is_admin() then raise exception 'Administrator access required' using errcode='42501'; end if;
 if length(target_name)>200 then raise exception 'Name is too long'; end if;
 lock table public.asgc_admins in share row exclusive mode;
 select id into target from auth.users where lower(email)=lower(trim(target_email));
 if target is null then raise exception 'Create this account in Supabase Authentication first'; end if;
 if not enabled and target=auth.uid() then raise exception 'You cannot disable your own administrator account'; end if;
 insert into public.asgc_admins(user_id,display_name,active) values(target,target_name,enabled)
 on conflict(user_id) do update set display_name=excluded.display_name,active=excluded.active;
end; $$;
revoke all on function public.asgc_list_users() from public;
revoke all on function public.asgc_manage_user(text,text,boolean) from public;
grant execute on function public.asgc_list_users() to authenticated;
grant execute on function public.asgc_manage_user(text,text,boolean) to authenticated;
commit;
begin;
drop policy "Visitors submit forms" on public.asgc_submissions;
create policy "Visitors submit forms" on public.asgc_submissions for insert to anon,authenticated with check (status='unread' and kind<>'registration');
create function public.asgc_register_event(event_id uuid,payload jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare item public.asgc_content; capacity integer;
begin
 if jsonb_typeof(payload)<>'object' or not public.asgc_submission_strings(payload) then raise exception 'Invalid registration data'; end if;
 select * into item from public.asgc_content where id=event_id and kind='event' for update;
 if item.id is null or item.status<>'published' or not coalesce((item.data->>'registration')::boolean,false) or coalesce((item.data->>'past')::boolean,false) then raise exception 'Registration is closed for this event'; end if;
 capacity:=coalesce((item.data->>'capacity')::integer,0);
 if capacity>0 and (select count(*) from public.asgc_submissions where kind='registration' and data->>'event_id'=item.id::text and status<>'cancelled')>=capacity then raise exception 'This event has reached its registration capacity'; end if;
 if exists(select 1 from public.asgc_submissions where kind='registration' and data->>'event_id'=item.id::text and lower(data->>'email')=lower(payload->>'email') and status<>'cancelled') then raise exception 'This email is already registered for this event'; end if;
 insert into public.asgc_submissions(kind,data) values('registration',payload || jsonb_build_object('event_id',item.id::text,'event',item.title));
end; $$;
revoke all on function public.asgc_register_event(uuid,jsonb) from public;
grant execute on function public.asgc_register_event(uuid,jsonb) to anon,authenticated;
commit;
create function public.asgc_public_statistics() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
 'mandates',coalesce((select jsonb_array_length(data->'arrays'->'mandateItems') from public.asgc_content where kind='page' and slug='home' and status='published'),0),
 'partners',(select count(*) from public.asgc_content where kind='partner' and status='published'),
 'programmes',(select count(*) from public.asgc_content where kind='programme' and status='published'),
 'registrations',(select count(*) from public.asgc_submissions where kind='registration' and status='confirmed'));
$$;
revoke all on function public.asgc_public_statistics() from public;
grant execute on function public.asgc_public_statistics() to anon,authenticated;
