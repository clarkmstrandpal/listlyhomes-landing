import React, { useState } from "react";
import { postJSON } from "../lib/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    if (!email) return setStatus("Please enter your email.");
    setBusy(true);
    try {
      // Backend endpoint will be added next: /v1/agents/reset/request
      await postJSON("/v1/agents/reset/request", { email });
      setStatus("If that email exists, a reset link has been sent.");
    } catch (err) {
      setStatus(`Error: ${err?.message || err}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 8 }}>Reset your password</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Enter your email and we’ll send a reset link.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Sending..." : "Send reset link"}
        </button>

        {status ? (
          <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.06)" }}>
            {status}
          </div>
        ) : null}
      </form>
    </div>
  );
}
