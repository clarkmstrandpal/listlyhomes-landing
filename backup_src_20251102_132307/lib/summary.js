// src/lib/summary.js
import { API_BASE } from "./api"; // re-use base

export async function fetchLeadsSummary(params = {}) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).length) usp.set(k, String(v));
  }
  const url = `${API_BASE}/v1/leads/summary?${usp.toString()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`Summary ${res.status}`);
  return await res.json();
}