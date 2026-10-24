-- Update shared contact numbers, preserving other settings.
update public.asgc_content
set data = jsonb_set(data, '{phone}', to_jsonb('+234 913 800 0004 / +234 913 800 0005'::text)),
    updated_at = now()
where kind = 'settings' and slug = 'global';
