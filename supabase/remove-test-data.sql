-- Remove only records explicitly tagged as temporary testing data.
begin;
delete from public.asgc_submissions where data->>'test_data'='true';
delete from public.asgc_content where data->>'test_data'='true';
delete from auth.users where email like '%@example.invalid' and raw_user_meta_data->>'test_data'='true';
commit;
