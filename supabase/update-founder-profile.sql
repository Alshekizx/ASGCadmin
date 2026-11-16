-- Publish the requested Founder / Executive Profile copy.
update public.asgc_content
set data = jsonb_set(
  data,
  '{blocks}',
  coalesce(data->'blocks', '{}'::jsonb) || jsonb_build_object(
    'heading_11', 'Career Profile',
    'heading_12', 'Executive Profile',
    'profile_1', 'Ambassador Ahmed Sule',
    'profile_2', 'Founder and Chief Executive Officer — Ahmed Sule Global Center for Diplomacy, Trade and Investment (ASGC)',
    'profile_3', 'Ambassador Ahmed Sule is a Nigerian career diplomat who served as Nigeria’s High Commissioner to India, with concurrent responsibility for Bangladesh, Sri Lanka and Nepal. He now leads ASGC in Abuja, drawing on his experience in bilateral relations, multilateral diplomacy and investment promotion.',
    'profile_4', 'Ambassador Sule began his career at the Ministry of Foreign Affairs in Abuja. Over the course of his career, he served as Third Secretary, Second Secretary, Counsellor, Senior Counsellor, Minister Counsellor, Assistant Director, Deputy Director and Director.',
    'profile_5', 'His overseas postings took him to Saudi Arabia, Canada, the United Kingdom, India, Bangladesh, Sri Lanka and Nepal, as well as Nigeria’s Permanent Mission to the United Nations in New York.',
    'profile_6', 'In Abuja, Ambassador Sule served as Special Assistant to the Minister of Foreign Affairs. He advised the Minister on promoting international trade and investment. He also served as Personal Assistant to the Minister of State for Foreign Affairs and as Director of Protocol in the Office of the First Lady of Nigeria. His appointments within the Ministry included Assistant Director for European Affairs and Director of the Middle East and Gulf Division.',
    'profile_7', 'As High Commissioner to India, Ambassador Sule facilitated US$14 billion in investment pledges for Nigeria during the G20 Summit in New Delhi. He also supported Nigeria’s diplomatic efforts during its successful legal challenge before the Commercial Court in London in the dispute with Process & Industrial Developments (P & ID). Nigeria Won, freeing the country from a liability of about US$11Billion.'
  ),
  true
)
where kind = 'page' and slug = 'founder';
