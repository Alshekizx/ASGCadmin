import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { corsHeaders } from "@supabase/supabase-js/cors";
const caller = "00000000-0000-0000-0000-000000000001";
async function handler({ valid = true, approved = true } = {}) {
  let serve,
    calls = 0;
  const source = (
    await readFile(
      new URL(
        "../supabase/functions/asgc-admin-users/index.ts",
        import.meta.url,
      ),
      "utf8",
    )
  ).replace(/^import[^\n]+\n/gm, "");
  const viewer = {
    auth: {
      getUser: async () => ({
        data: { user: valid ? { id: caller } : null },
        error: null,
      }),
    },
    rpc: async (name) => ({
      data: name === "asgc_is_admin" ? approved : null,
      error: null,
    }),
  };
  const service = {
    auth: {
      admin: {
        createUser: async () => {
          calls++;
          return {
            data: { user: { id: "00000000-0000-0000-0000-000000000002" } },
            error: null,
          };
        },
        deleteUser: async () => {
          calls++;
          return { error: null };
        },
        updateUserById: async () => {
          calls++;
          return { error: null };
        },
      },
    },
  };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      Request,
      Response,
      JSON,
      Number,
      String,
      corsHeaders,
      Deno: {
        env: { get: () => "" },
        serve: (value) => {
          serve = value;
        },
      },
      createClient: (_url, _key, options) =>
        options.global ? viewer : service,
    },
  );
  return {
    invoke: (body) =>
      serve(
        new Request("https://test.example", {
          method: "POST",
          headers: {
            Authorization: "Bearer user-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }),
      ),
    calls: () => calls,
  };
}
test("account management rejects invalid and unapproved users before invoking privileged APIs", async () => {
  for (const options of [{ valid: false }, { approved: false }]) {
    const check = await handler(options);
    const response = await check.invoke({
      action: "create",
      email: "test@example.invalid",
      name: "Test",
      password: "LongTestPassword!",
      enabled: true,
    });
    assert([401, 403].includes(response.status));
    assert.equal(check.calls(), 0);
  }
});
test("approved admins create accounts, while deleting the caller is prevented", async () => {
  const check = await handler();
  const denied = await check.invoke({ action: "delete", id: caller });
  assert.equal(denied.status, 400);
  assert.equal(check.calls(), 0);
  const result = await check.invoke({
    action: "create",
    email: "test@example.invalid",
    name: "Test",
    password: "LongTestPassword!",
    enabled: false,
  });
  assert.equal(result.status, 201);
  assert.equal(check.calls(), 1);
});
test("password rules are enforced without calling the privileged user API", async () => {
  const check = await handler();
  const response = await check.invoke({
    action: "password",
    id: caller,
    password: "short",
  });
  assert.equal(response.status, 400);
  assert.equal(check.calls(), 0);
});
