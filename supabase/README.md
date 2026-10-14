Database setup was applied to project `szrrdgiivhfhvugemvfu` on 14 October 2026. The account `seyiduncan40@gmail.com` has been created and approved as an administrator. Do not rerun `setup.sql` against this project; its migration has already been applied.

Live checks passed for administrator sign-in, published content access, blocked anonymous inbox reads, contact/partnership/newsletter submissions, administrator status updates, draft creation, and public draft exclusion. All temporary test records were removed. The database contains 25 seeded public content records, RLS on all three ASGC tables, the public asset bucket, and realtime publication for content and submissions.

Both websites use project `szrrdgiivhfhvugemvfu`. The browser clients contain only its publishable key. A different project can be selected with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel, followed by a redeploy.

Connected workflows:

- Contact and partnership forms save private submissions; approved admins can read, update status, and delete them in Messages.
- Newsletter subscriptions save to the admin Newsletter list.
- Admins create, edit, publish, archive, and delete News & Insights, Publications & Research, and Media & Gallery items. Public pages read only published items.
- News includes article bodies; publications and speeches support PDF uploads; the gallery supports photos, video links, press releases, and media coverage links.
- Updates refresh through Supabase Realtime, on window focus, and periodic public refreshes. The seed preserves the current public content.

To activate:

1. Connect the Supabase plugin so the setup can be applied directly, or open the project's SQL Editor and run `setup.sql` once. It creates new ASGC tables, policies, asset storage, and loads the existing site content. Do not rerun the table migration after a successful setup; the seed itself is safe to rerun.
2. In Supabase Authentication, create a password-based user for `seyiduncan40@gmail.com` if it does not already exist. Choose the password in Supabase; no password or secret key belongs in source control.
3. Run `approve-admin.sql` after that account exists. Sign in to the admin website with that account. Other authenticated users are not granted administrator permissions.
4. Deploy both repositories to Vercel after the database setup is complete. Set `VITE_ADMIN_URL` on the public website if the `/admin` page should link to the separately hosted admin portal.
5. Verify a contact enquiry, partnership enquiry, and newsletter subscription appear in the admin portal. Publish a draft article and reload the public News page; confirm unpublishing removes it. Upload a publication PDF and gallery image and check the public links.

The browser publishable key cannot create SQL tables. A database-management connection or SQL Editor access is required for the migration. No secret key has been stored in either repository.

`npm test` runs the migration and seed against local PostgreSQL using PGlite, verifying public writes, private submissions, draft visibility, rejected non-admin writes, and approved administrator access. Storage HTTP delivery and realtime connections require live-project verification.

These changes cover the requested workflows. Events, programme editing, website settings, and user management are outside this integration's scope. Supabase stores enquiries and subscriptions; it does not automatically send email replies or newsletter campaigns.
