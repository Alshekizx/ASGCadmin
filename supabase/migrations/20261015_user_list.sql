create or replace function public.asgc_list_users() returns table(user_id uuid,email text,display_name text,active boolean,approved boolean,created_at timestamptz,last_sign_in_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
 if not public.asgc_is_admin() then raise exception 'Administrator access required' using errcode='42501'; end if;
 return query select u.id,u.email::text,coalesce(nullif(a.display_name,''),u.raw_user_meta_data->>'display_name',''),coalesce(a.active,false),a.user_id is not null,u.created_at,u.last_sign_in_at from auth.users u left join public.asgc_admins a on a.user_id=u.id order by u.created_at;
end; $$;
