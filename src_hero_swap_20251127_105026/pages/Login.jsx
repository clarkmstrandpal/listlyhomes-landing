import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function Login(){
  const { login } = useAuth();
  const [email, setEmail] = useState("cclark@prodigyassurance.com");
  const [password, setPassword] = useState("K@t13DyD");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr(""); setOk(""); setBusy(true);
    try{
      await login(email.trim(), password);
      setOk("Login successful. Redirecting");
      // AuthProvider will navigate to /dashboard
    }catch(ex){
      setErr(ex?.message || "Login failed");
      console.error("Login error:", ex);
    }finally{
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="border rounded p-4 space-y-3">
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="border px-3 py-2 rounded" autoComplete="username" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="border px-3 py-2 rounded" autoComplete="current-password" />
        </label>
        {ok && <p className="text-green-700 text-sm border border-green-300 rounded p-2">{ok}</p>}
        {err && <p className="text-red-700 text-sm border border-red-300 rounded p-2">Error: {err}</p>}
        <button disabled={busy} className="px-3 py-2 rounded bg-black text-white w-full">
          {busy ? "Signing in" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
