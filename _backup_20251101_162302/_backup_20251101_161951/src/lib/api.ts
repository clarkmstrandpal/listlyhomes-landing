// src/lib/api.ts
import { signBody } from "./sign";

export interface Lead {
  lead_id: string;
  name?: string;
  email?: string;
  zip?: string;
  price?: number;
  beds?: number;
  baths?: number;
  claimed?: boolean;
  [k: string]: unknown;
}

export interface LeadsListResponse {
  items?: Lead[];
  leads?: Lead[];
  next_cursor?: string | null;
  LastEvaluatedKey?: string | null;
  [k: string]: unknown;
}

export const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

function getToken(): string {
  return localStorage.getItem("buyerboard_token") || "";
}

function baseHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const tok = getToken();
  if (tok) headers.Authorization = `Bearer ${tok}`;
  return headers;
}

export async function postJSON<T = unknown>(
  path: string,
  payload: Record<string, unknown> = {},
  signal?: AbortSignal
): Promise<T> {
  if (!API_BASE) throw new Error("API base not configured");
  const bodyString = JSON.stringify(payload);
  const headers = baseHeaders();

  const secret = import.meta.env.VITE_HMAC_SECRET as string | undefined;
  if (secret) {
    const { ts, sig } = await signBody(bodyString, secret);
    headers["X-Timestamp"] = String(ts);
    headers["X-Signature"] = sig;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: bodyString,
    signal,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  try { return (await res.json()) as T; } catch { return {} as T; }
}

export async function getJSON<T = unknown>(
  path: string,
  params: Record<string, string | number> = {},
  signal?: AbortSignal
): Promise<T> {
  if (!API_BASE) throw new Error("API base not configured");
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  ).toString();
  const url = `${API_BASE}${path}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { headers: baseHeaders(), signal });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  try { return (await res.json()) as T; } catch { return {} as T; }
}

/* ---- BuyersBoard helpers ---- */

export async function fetchLeads(
  params: Record<string, string | number> = {}
): Promise<Lead[] | LeadsListResponse> {
  return getJSON<Lead[] | LeadsListResponse>("/v1/leads/summary", params);
}

export async function listLeads(
  params: Record<string, string | number> = {}
): Promise<LeadsListResponse | Lead[]> {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  ).toString();
  const headers = baseHeaders();

  let res = await fetch(`${API_BASE}/v1/leads/list${qs ? `?${qs}` : ""}`, { headers });
  if (res.status === 404) {
    res = await fetch(`${API_BASE}/v1/leads/summary${qs ? `?${qs}` : ""}`, { headers });
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => "")}`);
  return (await res.json()) as LeadsListResponse | Lead[];
}

export async function claimLead(lead_id: string): Promise<unknown> {
  return postJSON("/v1/leads/claim", { lead_id });
}
