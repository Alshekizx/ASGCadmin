import { test } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { PGlite } from "@electric-sql/pglite"

test("public submissions stay private and only approved admins manage content", async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      create table storage.buckets (id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects (id uuid default gen_random_uuid(),bucket_id text);
      alter table storage.objects enable row level security;
      grant usage on schema public,auth,storage to anon,authenticated;
      grant execute on function auth.uid() to anon,authenticated;
      insert into auth.users values ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
    `)
    const migration = await readFile(
      new URL("../supabase/migrations/20261014_asgc.sql", import.meta.url),
      "utf8",
    )
    // Local PostgreSQL has no Supabase realtime publication; all actual table/grant/policy SQL is exercised.
    assert.match(migration, /alter publication supabase_realtime add table/)
    await db.exec(
      migration.replace(
        /alter publication supabase_realtime add table[^;]+;/,
        "",
      ),
    )
    await db.exec(
      await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8"),
    )
    await db.exec(
      `insert into public.asgc_admins(user_id) values('00000000-0000-0000-0000-000000000001');`,
    )
    await db.exec(
      `insert into public.asgc_content(kind,slug,title,status,data) values('news','private-draft','Private draft','draft','{}');`,
    )

    await db.exec("set role anon")
    const publicRows = await db.query("select status from public.asgc_content")
    assert.ok(publicRows.rows.length > 0, "seeded content remains public")
    assert.ok(publicRows.rows.every((row) => row.status === "published"))
    for (const kind of ["contact", "partnership", "newsletter"])
      await db.query(
        "insert into public.asgc_submissions(kind,data) values($1,$2)",
        [kind, { email: "visitor@example.com", message: "Test" }],
      )
    await assert.rejects(
      db.query("select * from public.asgc_submissions"),
      /permission denied/,
    )
    await assert.rejects(
      db.query(
        "insert into public.asgc_submissions(kind,data,status) values('contact','{\"email\":\"visitor@example.com\"}','read')",
      ),
      /permission denied/,
    )
    await assert.rejects(
      db.query(
        "insert into public.asgc_submissions(kind,data) values('contact','{}')",
      ),
      /check constraint/,
    )
    await assert.rejects(
      db.query("insert into public.asgc_submissions(kind,data) values('contact','{\"email\":\"visitor@example.com\",\"message\":{}}')"),
      /check constraint/,
    );
    await assert.rejects(
      db.query(
        "insert into public.asgc_content(kind,slug,title) values('news','forged','Forged')",
      ),
      /permission denied/,
    )
    await assert.rejects(
      db.query(
        "insert into public.asgc_admins(user_id) values('00000000-0000-0000-0000-000000000002')",
      ),
      /permission denied/,
    )

    await db.exec(
      "reset role; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002'; set role authenticated;",
    )
    assert.equal(
      (await db.query("select public.asgc_is_admin() as allowed")).rows[0]
        .allowed,
      false,
    )
    assert.equal(
      (await db.query("select * from public.asgc_submissions")).rows.length,
      0,
    )
    assert.equal(
      (await db.query("select * from public.asgc_content where status='draft'"))
        .rows.length,
      0,
    )
    await assert.rejects(
      db.query(
        "insert into public.asgc_content(kind,slug,title) values('news','forged','Forged')",
      ),
      /row-level security/,
    )

    await db.exec(
      "reset role; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001'; set role authenticated;",
    )
    assert.equal(
      (await db.query("select public.asgc_is_admin() as allowed")).rows[0]
        .allowed,
      true,
    )
    assert.equal(
      (await db.query("select * from public.asgc_submissions")).rows.length,
      3,
    )
    assert.equal(
      (
        await db.query(
          "select * from public.asgc_content where slug='private-draft'",
        )
      ).rows.length,
      1,
    )
    await db.exec(
      "update public.asgc_content set status='published' where slug='private-draft'; update public.asgc_submissions set status='read' where kind='contact';",
    )
    await db.exec("reset role; set request.jwt.claim.sub = ''; set role anon;")
    assert.equal(
      (
        await db.query(
          "select * from public.asgc_content where slug='private-draft'",
        )
      ).rows.length,
      1,
    )
  } finally {
    await db.close()
  }
})
