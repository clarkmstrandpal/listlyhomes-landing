import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    // TODO: replace with real auth call
    await new Promise((r) => setTimeout(r, 600));
    auth.login();
    setLoading(false);
    nav("/dashboard");
  }

  return (
    <main className="px-4 py-16">
      <div className="mx-auto w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Log in</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Use any email/password for now (mock auth). You’ll be redirected to the dashboard.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <button
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <Link to="/" className="text-blue-600 hover:underline">← Back to site</Link>
        </div>
      </div>
    </main>
  );
}
