import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [loading, setLoading]   = useState(false);
  const nav = useNavigate();

  const valid =
    username.trim().length >= 3 &&
    /^[a-zA-Z0-9._-]+$/.test(username) &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
    pass.length >= 6;

  async function submit(e) {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    // TODO: replace with real API call to create account
    await new Promise(r => setTimeout(r, 700));
    auth.login();  // mock: treat as signed-in
    setLoading(false);
    nav("/dashboard");
  }

  return (
    <main className="px-4 py-16">
      <div className="mx-auto w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Create your account</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Pick a username; weâ€™ll use this for your portal.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="team-austin"
              required
            />
            <p className="text-xs text-gray-500 mt-1">3+ chars. Letters, numbers, -, _, .</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="min 6 characters"
              required
            />
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 text-slate-900 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={!valid || loading}
          >
            {loading ? "Creatingâ€¦" : "Create account"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      </div>
    </main>
  );
}


