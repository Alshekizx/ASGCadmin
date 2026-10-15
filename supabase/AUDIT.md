# Supabase integration audit

All requested sections use the same ASGC Supabase project. The frontend no longer imports local sample news, publications, events, programmes, media, leadership or partner collections. Editable page text and lists have been migrated to page records. Unused prototype screens, fake notifications and fake success actions have been removed.

## Verified workflows

- Opened all eleven public routes against the live database and checked for browser page errors.
- Opened every admin section against the live database.
- Created a private draft article, verified it was absent from the public site, published it, and verified its title and body on the article route.
- Created a programme through the admin editor and verified it on the public programmes page.
- Changed About page text, verified the public heading, and restored it.
- Cleared and re-added a page list without losing its field schema; created a published custom page, verified its public URL, then deleted it and verified the route disappeared.
- Changed the shared enquiries email, verified the contact page, and restored `info@asgc.us.com`.
- Submitted contact and partnership forms and found the actual messages in the private admin inbox.
- Registered through the public event form and found the actual record under Registrations.
- Subscribed through the footer and found the actual address under Newsletter.
- Created and deleted an account through the browser, verifying the protected account function and browser CORS.
- Verified real account password changes, account approval/suspension and deletion; anonymous and non-admin account operations were rejected.
- Verified writes, public reads and unpublishing for publications, photos, partners, leadership, videos, press releases, speeches and coverage.
- Verified image uploads and PDF delivery from Supabase Storage, including a browser download of a valid separate test publication.
- Confirmed public clients cannot read private submissions, and drafts remain absent from public content queries.
- Checked event capacity, duplicate registration guards and real Auth-column types in local PostgreSQL tests.

The browser tests found a real `varchar`/`text` mismatch in the Auth user-list RPC. Its return cast was corrected in the live database, the fixture now matches Supabase's real schema, and the browser account workflow subsequently passed. Failed list refreshes no longer report a misleading saved notice.

## Current architecture

`asgc_content` stores typed content kinds. `asgc_submissions` stores private forms. `asgc_admins` controls active administrator access. Supabase Authentication stores accounts. The protected `asgc-admin-users` Edge Function handles privileged account creation, password changes and deletion; no server key is included in either frontend.

Published founder/settings uniqueness guards prevent conflicting public sources. Founder name/photo/biography and partner/programme counts use their shared records. Registration records keep their event ID and display the current event title when it is available. The original illustrative homepage counts have been replaced with aggregate database counts. Page list schemas are stored with page records so editing an emptied list can preserve its structure.

Public reads refresh via realtime notifications, focus and 30-second polling; admin lists use realtime, focus and 15-second polling. The public query cache shares requests between components. Last known database responses may remain visible during a refresh; there is no local sample-data substitution. Runtime site metadata follows published settings; initial HTML metadata remains the deployment's site configuration.

## Test data and cleanup

Curated temporary records remain in Supabase for testing. They use a `test_data` flag, reserved `example.invalid` addresses or `[Test]` labels. Verification-only account/content/file records were removed after checking. One separate, clearly marked publication and valid PDF remain for download testing; no existing publication was overwritten for that fixture.

Use `remove-test-data.sql` when the curated fixtures are no longer wanted. Test PDFs in the Storage `testing/` folder are separate binary objects and can be removed through Storage after removing their records. Page copy, the real founder profile, official contact settings and genuine users are retained.

No email campaigns or automatic contact replies are implied by storing messages and newsletter addresses. Creating an account through this portal sends no sign-up email.

## Validation commands

- Both repositories: `npx tsc --noEmit`, `npm run build`, `git diff --check`.
- Admin: `npm test` (five policy/contract/account-handler tests).
- Real browser checks used the local versions of both apps against the live Supabase project. Production Vercel deployment verification requires the deployed site URLs.
