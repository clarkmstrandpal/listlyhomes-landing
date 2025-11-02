export const API_BASE = (import.meta.env.VITE_API_BASE || localStorage.getItem("bb_api_base") || "").replace(/\/+$/,"");
export async function loginAgent(email, password){
  if(!API_BASE) throw new Error("API base not set");
  const resp = await fetch(`${API_BASE}/v1/agents/login`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  if(!resp.ok) throw new Error(`Login failed (${resp.status})`);
  const data  = await resp.json();
  const token = data.token || data.api_key || data.key || data.access_token;
  if(token) localStorage.setItem("bb_api_key", token);
  localStorage.setItem("bb_user_email", email);
  return data;
}
