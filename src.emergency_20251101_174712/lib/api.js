/**
 * BuyersBoard API helpers
 */
export const API_BASE = (import.meta?.env?.VITE_API_BASE ?? "").replace(/\/+$/,"");

function toUrl(pathOrUrl) {
  if (!pathOrUrl) return API_BASE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = API_BASE || "";
  return base + (pathOrUrl.startsWith("/") ? pathOrUrl : "/" + pathOrUrl);
}

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  try { return await res.json(); } catch { return {}; }
}

export async function getJSON(path) {
  return handle(await fetch(toUrl(path), { headers: { "Content-Type": "application/json" }}));
}

export async function postJSON(path, body) {
  return handle(await fetch(toUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {})
  }));
}

// Convenience wrappers used in Dashboard/LeadForm/etc.
export async function fetchLeads(params = {}) {
  const qs = new URLSearchParams(params);
  return getJSON(`/v1/preview?${qs}`);
}

export async function listLeads(params = {}) {
  const qs = new URLSearchParams(params);
  return getJSON(`/v1/leads/list?${qs}`);
}

export async function claimLead(id, agent_email) {
  return postJSON("/v1/leads/claim", { id, agent_email });
}
