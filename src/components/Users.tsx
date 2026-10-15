import { useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase";
interface User {
  user_id: string;
  email: string;
  display_name: string;
  active: boolean;
  approved: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}
export default function Users() {
  const [users, setUsers] = useState<User[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [email, setEmail] = useState(""),
    [name, setName] = useState(""),
    [password, setPassword] = useState(""),
    [enabled, setEnabled] = useState(false),
    [testData, setTestData] = useState(false),
    [resetUser, setResetUser] = useState<User | null>(null),
    [newPassword, setNewPassword] = useState("");
  const client = requireSupabase();
  async function load() {
    try {
      const { data, error } = await client.rpc("asgc_list_users");
      if (error) throw new Error(error.message);
      setUsers(data ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (active)
        void load().catch((error) =>
          setError(
            error instanceof Error ? error.message : "Unable to load accounts.",
          ),
        );
    };
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function operation(callback: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await callback();
      await load();
      setNotice("Account changes saved.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
            ? String(error.message)
            : "Unable to save user.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function invoke(body: Record<string, unknown>) {
    const { data, error } = await client.functions.invoke("asgc-admin-users", {
      body,
    });
    if (error) {
      const response = (error as unknown as { context?: Response }).context;
      const detail =
        response instanceof Response
          ? await response.json().catch(() => null)
          : null;
      throw new Error(detail?.error || error.message);
    }
    if (data?.error) throw new Error(data.error);
  }
  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users & Administrator Access</h1>
      {loading && (
        <p role="status" className="mb-4 text-sm">
          Loading accounts…
        </p>
      )}
      {error && !resetUser && (
        <p role="alert" className="bg-red-50 text-red-700 p-3 mb-4">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="bg-green-50 text-green-800 p-3 mb-4">
          {notice}
        </p>
      )}
      <p className="text-sm text-gray-600 mb-5">
        Accounts are stored in Supabase Authentication. Approved administrators
        can manage this website. Creating an account does not send an email.
      </p>
      <form
        className="bg-white border rounded p-5 space-y-3 mb-6"
        onSubmit={(event) => {
          event.preventDefault();
          void operation(async () => {
            await invoke({
              action: "create",
              email,
              name,
              password,
              enabled,
              test_data: testData,
            });
            setEmail("");
            setName("");
            setPassword("");
          });
        }}
      >
        <h2 className="font-semibold">Create account</h2>
        <label className="block text-sm">
          Account email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block border rounded w-full p-2"
          />
        </label>
        <label className="block text-sm">
          Display name
          <input
            required
            maxLength={200}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block border rounded w-full p-2"
          />
        </label>
        <label className="block text-sm">
          Temporary password
          <input
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="block border rounded w-full p-2"
          />
        </label>
        <label className="block text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />{" "}
          Approve administrator access
        </label>
        <label className="block text-sm">
          <input
            type="checkbox"
            checked={testData}
            onChange={(event) => setTestData(event.target.checked)}
          />{" "}
          Temporary test account
        </label>
        <button
          disabled={busy}
          className="bg-[#0d1e35] text-white rounded px-4 py-2"
        >
          {busy ? "Saving…" : "Create account"}
        </button>
      </form>
      <div className="space-y-3">
        {users.map((user) => (
          <article
            key={user.user_id}
            className="bg-white border rounded p-4 flex flex-wrap justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold">
                {user.display_name || user.email}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs mt-1">
                {user.active
                  ? "Active administrator"
                  : "No administrator access"}
              </p>
              <p className="text-xs text-gray-500">
                Last sign in:{" "}
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("en-GB", {
                      timeZone: "Africa/Lagos",
                    })
                  : "Never"}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                disabled={busy}
                className="text-sm text-[#96790f]"
                onClick={() =>
                  void operation(async () => {
                    const { error } = await client.rpc("asgc_manage_user", {
                      target_email: user.email,
                      target_name: user.display_name,
                      enabled: !user.active,
                    });
                    if (error) throw error;
                  })
                }
              >
                {user.active ? "Suspend access" : "Enable access"}
              </button>
              <button
                disabled={busy}
                className="text-sm"
                onClick={() => {
                  setResetUser(user);
                  setNewPassword("");
                }}
              >
                Change password
              </button>
              <button
                disabled={busy}
                className="text-sm text-red-700"
                onClick={() => {
                  if (window.confirm(`Delete the account ${user.email}?`))
                    void operation(() =>
                      invoke({ action: "delete", id: user.user_id }),
                    );
                }}
              >
                Delete account
              </button>
            </div>
          </article>
        ))}
      </div>
      {resetUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Change account password"
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50"
        >
          <form
            className="bg-white rounded p-6 w-full max-w-md space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void operation(async () => {
                await invoke({
                  action: "password",
                  id: resetUser.user_id,
                  password: newPassword,
                });
                setResetUser(null);
                setNewPassword("");
              });
            }}
          >
            <h2 className="font-semibold">
              Change password for {resetUser.email}
            </h2>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <label className="block text-sm">
              New password
              <input
                required
                minLength={12}
                autoComplete="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="block border rounded w-full p-2"
              />
            </label>
            <div className="flex gap-3">
              <button
                disabled={busy}
                className="rounded bg-[#0d1e35] text-white px-4 py-2"
              >
                Save password
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setResetUser(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
