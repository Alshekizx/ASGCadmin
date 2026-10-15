Both websites use Supabase project `szrrdgiivhfhvugemvfu`. All live sections use the database; no client-side sample collections or prototype success actions remain.

| Admin section | Stored data | Public consumer |
| --- | --- | --- |
| Events | `asgc_content`, kind `event` | Events page and home event list |
| Website Pages | kind `page` | Home, About, Our Work, Founder, Programmes, Events, News, Publications, Media, Partnerships, Contact; additional pages use their published URL name |
| Programmes | kind `programme` | Programmes page and actual programme statistic |
| Publications | kind `publication`, files in Storage | Publication cards and download links |
| Leadership | kind `leadership` | About directory, founder name/photo/biography on home and founder pages |
| Partners | kind `partner` | Partnerships directory and partner statistic |
| Media | kinds `photo`, `video`, `press`, `speech`, `coverage` | Every media tab |
| Messages | `asgc_submissions`, contact and partnership kinds | Public forms write; only active admins read |
| Registrations | submission kind `registration` | Event form writes through validated registration RPC |
| Newsletter | submission kind `newsletter` | Footer subscription form |
| Users | Supabase Authentication and `asgc_admins` | Protected account operations and access management |
| Website Settings | kind `settings` | Organisation names, contact details, logos, social URLs, map location and runtime site metadata |

The public client caches actual database responses, shares requests between components, and refreshes on realtime notifications, focus and 30-second polling. Admin lists refresh on realtime notifications, focus and 15-second polling. Errors and empty states do not substitute local sample data. Homepage statistics are database aggregates; the old illustrative counts are removed.

Public content requires `published` status. Submissions and user information remain private. Registrations validate the published event, open/past flags, duplicate registrations and capacity while holding an event-row lock. A single published founder and settings record prevents conflicting sources. Suspended administrator accounts lose database permissions; the admin sign-in gate also rechecks access periodically.

The `asgc-admin-users` Edge Function validates the caller's session with Supabase Auth and requires active ASGC admin membership before using privileged APIs. It creates accounts without sending email, changes passwords, and deletes accounts. Self-deletion is prevented. Browser code contains only the publishable key. Server keys are supplied by Supabase's function environment.

Database changes and the account function are already deployed to the current project. Do not rerun table-creation scripts on this project. For a fresh project, run `setup.sql`, create the initial administrator account in Supabase Authentication and run `approve-admin.sql`. Deploy the Edge Function from this repository with `supabase functions deploy asgc-admin-users --project-ref YOUR_PROJECT_REF`; its config uses handler-side session verification. Vercel deploys the two frontend repositories.

Temporary content and inbox fixtures are flagged `test_data` and use `[Test]` labels or reserved `example.invalid` addresses. One separate temporary publication includes a valid PDF in Storage for download testing. `remove-test-data.sql` removes tagged content/submissions and reserved temporary authentication accounts. The public asset bucket serves website files; delete test PDFs from the Storage `testing/` folder when those test records are removed.

Validation is recorded in `AUDIT.md`. `npm test` verifies database policies, every collection, capacity rules, actual Auth column types, access management and privileged account-handler guards. Both apps also pass TypeScript checks and production builds.
