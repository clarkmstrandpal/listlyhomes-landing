import { API_BASE } from "./api";

export async function authFetchJSON(path, { method="GET", body=null, headers={} } = {}){
  const token = typeof window !== "undefined" ? localStorage.getItem("bb_token") : null;
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const resp = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : null });

  if (resp.status === 401) {
    try { localStorage.removeItem("bb_token"); } catch {}
    if (typeof window !== "undefined") location.hash = "#/login";
    throw new Error("Unauthorized");
  }
  if (!resp.ok) {
    const txt = await resp.text().catch(()=>"");
    throw new Error(txt || `HTTP ${resp.status}`);
  }
  return resp.json();
}
