// src/lib/api.js
// JS-only (no JSX). PowerShell/Vite safe.

// Keep legacy exports used elsewhere in the app:
export const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  localStorage.getItem("buyerboard_api") ||
  "https://2v0q4zm2v6.execute-api.us-east-1.amazonaws.com/dev";

export function getToken() {
  return localStorage.getItem("bb_token") || "";
}

function apiBase() {
  return API_BASE;
}

function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return {};
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function getAgentEmail() {
  const saved =
    localStorage.getItem("bb_agent_email") ||
    localStorage.getItem("agent_email") ||
    "";
  if (saved) return saved;

  const t = getToken();
  if (!t) return "";

  const payload = parseJwt(t);
  return payload.email || payload.agent_email || payload.sub || "";
}

export async function getJSON(path, opts = {}) {
  const url = /^https?:\/\//i.test(path)
  ? path
  : `${apiBase()}${path}`;

  const headers = Object.assign(
    { Accept: "application/json" },
    opts.headers || {}
  );

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const agentEmail = getAgentEmail();
  if (agentEmail && !headers["x-agent-email"]) {
    headers["x-agent-email"] = agentEmail;
  }

  const res = await fetch(url, { method: "GET", ...opts, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) ? (data.error || data.message) : text;
    throw new Error(`[${res.status}] ${msg || "Request failed"}`);
  }
  return data;
}

export async function postJSON(path, body, opts = {}) {
 const url = /^https?:\/\//i.test(path)
  ? path
  : `${apiBase()}${path}`;

  const headers = Object.assign(
    { "Content-Type": "application/json", Accept: "application/json" },
    opts.headers || {}
  );

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const agentEmail = getAgentEmail();
  if (agentEmail && !headers["x-agent-email"]) {
    headers["x-agent-email"] = agentEmail;
  }

  const res = await fetch(url, {
    method: "POST",
    ...opts,
    headers,
    body: JSON.stringify(body || {})
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) ? (data.error || data.message) : text;
    throw new Error(`[${res.status}] ${msg || "Request failed"}`);
  }
  return data;
}

export async function listLeads({ limit = 50, cursor = "", status = "", zip_prefix = "" } = {}) {
  const qp = new URLSearchParams();
  qp.set("limit", String(limit));
  if (cursor) qp.set("cursor", cursor);
  if (status) qp.set("status", status);
  if (zip_prefix) qp.set("zip_prefix", zip_prefix);

  return getJSON(`/v1/leads/list?${qp.toString()}`);
}

export async function claimLead(lead_id) {
  if (!lead_id) throw new Error("Missing lead_id");
  return postJSON("/v1/claim", { lead_id });
}

export async function loginAgent(email, password) {
  if (!email || !password) throw new Error("Missing email or password");
  const resp = await postJSON("/v1/agents/login", { email, password });

  if (resp && resp.token) localStorage.setItem("bb_token", resp.token);
  localStorage.setItem("bb_agent_email", email);

  return resp;
}
