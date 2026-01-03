// src/lib/api.js
// Unified API helpers for BuyersBoard
const FALLBACK_API = "https://2v0q4zm2v6.execute-api.us-east-1.amazonaws.com/dev";

export const API_BASE = ((import.meta && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : FALLBACK_API).replace(/\/+$/, "");

// ---------- internals ----------
async function parseText(resp){
  const txt = await resp.text().catch(() => "");
  try { return { txt, json: txt ? JSON.parse(txt) : null }; }
  catch { return { txt, json: null }; }
}
function errMsg(status, parsed){
  const fromJson = parsed.json && (parsed.json.error || parsed.json.message);
  const fromText = !fromJson && parsed.txt ? parsed.txt : "";
  return `[${status}] ${fromJson || fromText || "Request failed"}`;
}

// ---------- core fetchers ----------
export async function getJSON(pathOrUrl, opts = {}){
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API_BASE}${pathOrUrl}`;
  const resp = await fetch(url, { mode: "cors", ...opts });
  const parsed = await parseText(resp);
  if(!resp.ok){ const e = new Error(errMsg(resp.status, parsed)); e.status = resp.status; throw e; }
  return parsed.json ?? null;
}
export async function postJSON(pathOrUrl, body, opts = {}){
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API_BASE}${pathOrUrl}`;
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), mode: "cors" });
  const parsed = await parseText(resp);
  if(!resp.ok){ const e = new Error(errMsg(resp.status, parsed)); e.status = resp.status; throw e; }
  return parsed.json ?? null;
}

// ---------- auth helpers ----------
const TOKEN_KEY = "bb_token";
export function getToken(){ try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } }
export function authHeaders(extra = {}) {
  const t = getToken();
  return t ? { ...extra, Authorization: `Bearer ${t}` } : { ...extra };
}

// ---------- BuyersBoard helpers ----------
export async function listLeads(params = {}){
  const usp = new URLSearchParams();
  for (const [k,v] of Object.entries(params)){
    if (v !== undefined && v !== null && String(v).length) usp.set(k, String(v));
  }
  let url = `${API_BASE}/v1/leads/list`;
  const qs = usp.toString();
  if (qs) url += `?${qs}`;

  // Try /list; fallback to /summary
  let res = await fetch(url, { headers: authHeaders({ "Content-Type": "application/json" }), mode: "cors" });
  if (res.status === 404){
    const fb = `${API_BASE}/v1/leads/summary${qs ? `?${qs}` : ""}`;
    res = await fetch(fb, { headers: authHeaders({ "Content-Type": "application/json" }), mode: "cors" });
  }
  const parsed = await parseText(res);
  if(!res.ok){ const e = new Error(errMsg(res.status, parsed)); e.status = res.status; throw e; }
  return parsed.json ?? null;
}

export async function claimLead(lead_id){
  return postJSON("/v1/leads/claim", { lead_id }, { headers: authHeaders({}) });
}
export async function closeLead(lead_id, outcome){ // "sale" | "nosale"
  try{
    return await postJSON("/v1/leads/close", { lead_id, outcome }, { headers: authHeaders({}) });
  }catch(e){
    if(e && e.status === 404) throw new Error("Close API not available yet.");
    throw e;
  }
}
export async function archiveLead(lead_id){ // quick remove
  try{
    return await postJSON("/v1/leads/archive", { lead_id }, { headers: authHeaders({}) });
  }catch(e){
    if(e && e.status === 404) throw new Error("Archive API not available yet.");
    throw e;
  }
}
export async function missLead(lead_id){ // auto at T-0
  try{
    return await postJSON("/v1/leads/miss", { lead_id }, { headers: authHeaders({}) });
  }catch(e){
    if(e && e.status === 404) throw new Error("Miss API not available yet.");
    throw e;
  }
}
export async function reopenLead(lead_id){
  try{
    return await postJSON("/v1/leads/reopen", { lead_id }, { headers: authHeaders({}) });
  }catch(e){
    if(e && e.status === 404) throw new Error("Reopen API not available yet.");
    throw e;
  }
}

export async function getJSONAuth(path, init={}) {
  return getJSON(path, { ...(init||{}), headers: authHeaders(init.headers||{}) });
}
export async function postJSONAuth(path, body, init={}) {
  const headers = authHeaders({ "Content-Type":"application/json", ...(init.headers||{}) });
  return postJSON(path, body, { ...(init||{}), headers });
}
export async function me(){ return getJSONAuth("/v1/agents/me"); }
