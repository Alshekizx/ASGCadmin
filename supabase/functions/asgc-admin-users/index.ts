import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { corsHeaders } from "npm:@supabase/supabase-js@2.117.3/cors";
const cors = {
  ...corsHeaders,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST")
    return respond({ error: "Method not allowed" }, 405);
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer "))
    return respond({ error: "Sign in required" }, 401);
  const url = Deno.env.get("SUPABASE_URL")!,
    anon = Deno.env.get("SUPABASE_ANON_KEY")!,
    secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const viewer = createClient(url, anon, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: identity, error: identityError } = await viewer.auth.getUser(
    authorization.slice(7),
  );
  if (identityError || !identity.user)
    return respond({ error: "Sign in required" }, 401);
  const role = await viewer.rpc("asgc_is_admin");
  if (role.error || role.data !== true)
    return respond({ error: "Administrator access required" }, 403);
  const admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  try {
    if (Number(request.headers.get("Content-Length")) > 8192)
      return respond({ error: "Request is too large" }, 413);
    const body = await request.json();
    if (body.action === "create") {
      const email = String(body.email ?? "")
          .trim()
          .toLowerCase(),
        name = String(body.name ?? "").trim(),
        password = String(body.password ?? "");
      if (
        !email.includes("@") ||
        email.length > 320 ||
        !name ||
        name.length > 200 ||
        password.length < 12
      )
        return respond(
          {
            error:
              "Provide an email, name, and password of at least 12 characters",
          },
          400,
        );
      const created = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: name,
          test_data: body.test_data === true,
        },
      });
      if (created.error) return respond({ error: created.error.message }, 400);
      const approved = await viewer.rpc("asgc_manage_user", {
        target_email: email,
        target_name: name,
        enabled: body.enabled === true,
      });
      if (approved.error) {
        await admin.auth.admin.deleteUser(created.data.user.id);
        return respond({ error: approved.error.message }, 400);
      }
      return respond({ id: created.data.user.id, email }, 201);
    }
    const id = String(body.id ?? "");
    if (!/^[a-f0-9-]{36}$/i.test(id))
      return respond({ error: "Invalid user" }, 400);
    if (body.action === "delete") {
      if (id === identity.user.id)
        return respond(
          { error: "You cannot delete your own administrator account" },
          400,
        );
      const deleted = await admin.auth.admin.deleteUser(id);
      if (deleted.error) return respond({ error: deleted.error.message }, 400);
      return respond({ ok: true });
    }
    if (body.action === "password") {
      const password = String(body.password ?? "");
      if (password.length < 12)
        return respond(
          { error: "Password must be at least 12 characters" },
          400,
        );
      const updated = await admin.auth.admin.updateUserById(id, { password });
      if (updated.error) return respond({ error: updated.error.message }, 400);
      return respond({ ok: true });
    }
    return respond({ error: "Unknown action" }, 400);
  } catch {
    return respond(
      { error: "The account operation could not be completed" },
      400,
    );
  }
});
