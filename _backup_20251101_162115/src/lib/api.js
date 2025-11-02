
import { signBody } from "./sign.js";

export const API_BASE = (import.meta?.env?.VITE_API_BASE || "").replace(/\/+$/, "");

function toSearch(params = {}) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).length) usp.set(k, String(v));
  }
  return usp.toString();
}

async function http(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.error || data?.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

export async function listLeads(params = {}) {
  const search = toSearch(params);
  const url = `${API_BASE}/v1/leads/list${search ? `?${search}` : ""}`;
  return http(url, { method: "GET" });
}

export async function claimLead(leadId) {
  const body = { lead_id: leadId };
  const signed = typeof signBody === "function" ? await signBody(body) : body;
  const res = await fetch(`${API_BASE}/v1/leads/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signed),
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.error || data?.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}
export async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {})
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(\HTTP \ \\);
  }
  return res.json().catch(() => ({}));
}
