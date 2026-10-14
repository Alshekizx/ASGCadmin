-- The administrator must first exist in Supabase Authentication.
-- Run this statement again after creating that user if necessary.
insert into public.asgc_admins (user_id)
select id from auth.users where lower(email) = 'seyiduncan40@gmail.com'
on conflict (user_id) do nothing;
