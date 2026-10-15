import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";

export default function SupabaseAuth({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setChecking(false);
      return;
    }
    let active = true;
    let revision = 0;
    const check = async (hasSession: boolean) => {
      const current = ++revision;
      if (!hasSession) {
        if (active) {
          setAuthorized(false);
          setChecking(false);
        }
        return;
      }
      const { data, error } = await client.rpc("asgc_is_admin");
      if (!active || revision !== current) return;
      setAuthorized(!error && data === true);
      if (error)
        setMessage(
          "Unable to verify admin access. Please try signing in again.",
        );
      else if (!data)
        setMessage("This account does not have ASGC administrator access.");
      else setMessage("");
      setChecking(false);
    };
    // Run database requests outside the Auth callback to avoid auth-lock contention.
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        setTimeout(() => {
          if (active) void check(Boolean(session));
        }, 0);
      },
    );
    void client.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setMessage("Unable to restore your session. Please sign in again.");
        setChecking(false);
      } else void check(Boolean(data.session));
    });
    const roleCheck = setInterval(() => {
      void client.auth.getSession().then(({ data }) => {
        if (active) void check(Boolean(data.session));
      });
    }, 30000);
    return () => {
      clearInterval(roleCheck);
      active = false;
      revision++;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else setPassword("");
    } catch {
      setMessage("Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (authorized) return children;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1e35] p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-xl">
        <img
          src="/ASGC_colored_logo.png"
          alt="ASGC"
          className="w-32 mx-auto mb-6"
        />
        <h1 className="text-xl font-bold text-center mb-6">
          ASGC Administrator Sign In
        </h1>
        {!supabase ? (
          <p role="status">Admin services have not been configured yet.</p>
        ) : checking ? (
          <p role="status">Checking your session…</p>
        ) : (
          <form onSubmit={login} className="space-y-4">
            {message && (
              <p role="alert" className="text-sm text-red-700">
                {message}
              </p>
            )}
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full border rounded p-3"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full border rounded p-3"
              />
            </label>
            <button
              disabled={busy}
              className="w-full rounded bg-[#0d1e35] p-3 text-white disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign In"}
            </button>
            <p className="text-xs text-gray-500">
              Contact ceo@asgc.us.com for administrator access.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
