import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("every section uses secure shared data, registrations enforce capacity, and users use real auth records", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;
 create table auth.users(id uuid primary key,email varchar(255),created_at timestamptz default now(),last_sign_in_at timestamptz,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text);alter table storage.objects enable row level security;
 grant usage on schema public,auth,storage to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
 insert into auth.users(id,email) values('00000000-0000-0000-0000-000000000001','admin@example.com'),('00000000-0000-0000-0000-000000000002','reader@example.com');`);
    const base = await readFile(
      new URL("../supabase/migrations/20261014_asgc.sql", import.meta.url),
      "utf8",
    );
    await db.exec(
      base.replace(/alter publication supabase_realtime add table[^;]+;/, ""),
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/20261014_all_sections.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      await readFile(
        new URL("../supabase/all-sections-seed.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/20261014_contract_guards.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      `insert into public.asgc_admins(user_id) values('00000000-0000-0000-0000-000000000001');`,
    );
    const seeded = await db.query(
      "select distinct kind from public.asgc_content",
    );
    for (const kind of [
      "event",
      "programme",
      "page",
      "settings",
      "leadership",
      "partner",
    ])
      assert(
        seeded.rows.some((row) => row.kind === kind),
        kind,
      );
    const event = (
      await db.query(
        `insert into public.asgc_content(kind,slug,title,status,data)values('event','capacity-test','Capacity test','published','{"registration":true,"past":false,"capacity":1}') returning id;`,
      )
    ).rows[0].id;
    await db.exec("set role anon");
    await db.query("select public.asgc_register_event($1,$2)", [
      event,
      { email: "one@example.com", name: "Test attendee" },
    ]);
    await assert.rejects(
      db.query("select public.asgc_register_event($1,$2)", [
        event,
        { email: "two@example.com" },
      ]),
      /capacity/,
    );
    await assert.rejects(
      db.query(
        "insert into public.asgc_submissions(kind,data)values('registration','{\"email\":\"forged@example.com\"}')",
      ),
      /row-level security/,
    );
    await assert.rejects(
      db.query("select public.asgc_list_users()"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select * from public.asgc_submissions"),
      /permission denied/,
    );
    const stats = (
      await db.query("select public.asgc_public_statistics() as stats")
    ).rows[0].stats;
    assert.equal(stats.registrations, 0);
    assert.equal(stats.programmes, 6);
    await db.exec(
      "reset role;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';set role authenticated;",
    );
    assert.equal(
      (await db.query("select * from public.asgc_list_users()")).rows.length,
      2,
    );
    await db.query("select public.asgc_manage_user($1,$2,$3)", [
      "reader@example.com",
      "Second admin",
      true,
    ]);
    await assert.rejects(
      db.query("select public.asgc_manage_user($1,$2,$3)", [
        "admin@example.com",
        "Admin",
        false,
      ]),
      /own administrator/,
    );
    await db.exec(
      `update public.asgc_submissions set status='confirmed' where kind='registration';update public.asgc_content set data=jsonb_set(data,'{blocks,heading_1}','"Edited page heading"') where kind='page' and slug='about';`,
    );
    await db.exec(
      "reset role;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000002';set role authenticated;",
    );
    assert.equal(
      (await db.query("select public.asgc_is_admin() as allowed")).rows[0]
        .allowed,
      true,
    );
    await db.exec(
      "reset role;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';set role authenticated;",
    );
    await db.query("select public.asgc_manage_user($1,$2,$3)", [
      "reader@example.com",
      "Second admin",
      false,
    ]);
    await db.exec(
      "reset role;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000002';set role authenticated;",
    );
    assert.equal(
      (await db.query("select public.asgc_is_admin() as allowed")).rows[0]
        .allowed,
      false,
    );
    await assert.rejects(
      db.query("select * from public.asgc_list_users()"),
      /Administrator access required/,
    );
    await db.exec("reset role;set role anon");
    assert.equal(
      (
        await db.query(
          "select data->'blocks'->>'heading_1' as heading from public.asgc_content where kind='page' and slug='about'",
        )
      ).rows[0].heading,
      "Edited page heading",
    );
    assert.equal(
      (await db.query("select public.asgc_public_statistics() as stats"))
        .rows[0].stats.registrations,
      1,
    );
  } finally {
    await db.close();
  }
});
