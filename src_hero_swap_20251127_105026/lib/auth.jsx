import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE, getJSON, postJSON } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [token, setToken]  = useState(() => {
    try { return localStorage.getItem("bb_token"); } catch { return null; }
  });
  const [user, setUser]    = useState(null);
  const [loading, setLoading] = useState(!!token);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    async function fetchMe(){ 
      if(!token){ setUser(null); setLoading(false); return; }
      setLoading(true);
      try{
        const me = await getJSON(`${API_BASE}/v1/agents/me`, { headers: { Authorization: `Bearer ${token}` } });
        if(!cancel) setUser(me);
      }catch(e){
        // Only clear token on explicit 401; keep token on transient/network issues
        const status = (e && e.status) || (typeof e.message === "string" && /\[401\]/.test(e.message) ? 401 : 0);
        if(!cancel && status === 401){
          try { localStorage.removeItem("bb_token"); } catch {}
          setToken(null);
          setUser(null);
          navigate("/login", { replace: true });
        } else if(!cancel){
          console.warn("fetchMe failed (non-401), preserving token:", e);
        }
      }finally{
        if(!cancel) setLoading(false);
      }
    }
    fetchMe();
    return () => { cancel = true; };
  }, [token, navigate]);

  async function login(email, password){
    const res = await postJSON(`${API_BASE}/v1/agents/login`, { email, password });
    if(!res || !res.token) throw new Error(res?.error || "No token returned");
    try { localStorage.setItem("bb_token", res.token); } catch {}
    setToken(res.token);
    if(res.agent) setUser(res.agent);
    // HashRouter-safe redirect
    window.location.hash = "#/dashboard";
  }

  function logout(){
    try { localStorage.removeItem("bb_token"); } catch {}
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }

  const value = useMemo(() => ({ token, user, loading, login, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// exports
export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }){
  const { token, loading } = useAuth();
  if(loading) return <div style={{ padding: "2rem" }}>Loading</div>;
  if(!token) return <Navigate to="/login" replace />;
  return children;
}
