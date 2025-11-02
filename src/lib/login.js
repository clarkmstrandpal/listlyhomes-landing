import { postJSON, API_BASE } from "../lib/api";
export async function loginAgent(email, password) {
  const res = await postJSON(`${API_BASE}/v1/agents/login`, { email, password });
  if (res?.token) {
    localStorage.setItem("bb_jwt", res.token);
    window.location.href = "/dashboard";
  } else {
    throw new Error(res?.error || "Login failed");
  }
}
