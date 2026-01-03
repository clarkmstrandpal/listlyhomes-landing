// src/lib/login.js
import { postJSON } from "../lib/api";

const TOKEN_KEY = "bb_token";

export async function loginAgent(email, password) {
  const res = await postJSON("/v1/agents/login", { email, password });
  if (res?.token) {
    localStorage.setItem(TOKEN_KEY, res.token);
    // hash route for S3 + HashRouter
    window.location.hash = "#/dashboard";
  } else {
    throw new Error(res?.error || "Login failed");
  }
}
