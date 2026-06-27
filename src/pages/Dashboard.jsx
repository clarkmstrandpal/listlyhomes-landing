import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getToken } from "../lib/api";

/* ---------------- API helpers (tolerant) ---------------- */
function authHeaders(extra={}) {
  const t = (typeof getToken==="function" ? getToken() : (localStorage.getItem("bb_token")||""));
  return t ? { ...extra, Authorization: "Bearer " + t } : { ...extra };
}
function jsonAuth() { return authHeaders({ "Content-Type": "application/json" }); }
async function j(resp){ const txt = await resp.text().catch(()=> ""); try{ return txt?JSON.parse(txt):null }catch{ return null } }
function asInt(x,d=0){ const n=Number(x); return Number.isFinite(n)?n:d; }
function prettyTimer(s){ const m=Math.floor(s/60),sec=s%60; return `${m<10?"0":""}${m}:${sec<10?"0":""}${sec}`; }

async function tryGET(url){
  const r = await fetch(url, { headers: authHeaders() });
  const body = await j(r);
  if(!r.ok) throw new Error(`[${r.status}] ${body?.error||body?.message||"request failed"}`);
  return body;
}
function normalizeList(body){
  if(!body) return [];
  if(Array.isArray(body)) return body;
  const arr = body.Items || body.items || body.leads || body.results || body.data;
  if(Array.isArray(arr)) return arr;
  if(typeof body==="object") return Object.values(body);
  return [];
}
async function listLeadsTolerant(params={}){
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k,v])=>{
    if(v!==undefined && v!==null && String(v).length) usp.set(k, String(v));
  });
  const q = usp.toString();
  const urls = [
    API_BASE + "/v1/leads/list"    + (q?("?"+q):""),
    API_BASE + "/v1/leads/summary" + (q?("?"+q):""),
    API_BASE + "/v1/leads"         + (q?("?"+q):""),
  ];
  let lastErr=null, lastBody=null;
  for(const u of urls){
    try{ const body = await tryGET(u); lastBody=body; return normalizeList(body); }
    catch(e){ lastErr=e; }
  }
  if(lastBody) return normalizeList(lastBody);
  throw lastErr || new Error("Unable to fetch leads");
}

/* ---- claim: try multiple endpoints + both id/lead_id ---- */
async function tryClaimFlex(lead){
  const id = lead.id || lead.lead_id || lead.pk || lead.sk || "";
  const payloads = [
    { lead_id: id, id },    // send both keys
    { id },                 // id only
    { lead_id: id },        // lead_id only
  ];
  const urls = [
    API_BASE + "/v1/leads/claim",
    API_BASE + "/v1/leads/accept",
    API_BASE + "/v1/lead/claim",
    API_BASE + "/v1/claim",
  ];
  let lastErr=null;
  for(const url of urls){
    for(const body of payloads){
      try{
        const r = await fetch(url, { method:"POST", headers: jsonAuth(), body: JSON.stringify(body) });
        const data = await j(r);
        if(r.ok) return data || { ok:true };
        lastErr = new Error(`[${r.status}] ${data?.error||data?.message||"claim failed"}`);
      }catch(e){ lastErr=e; }
    }
  }
  throw lastErr || new Error("claim failed");
}

async function archiveLead(lead, reason="ignored"){
  const id = lead.id || lead.lead_id || "";
  const r = await fetch(API_BASE + "/v1/leads/archive", { method:"POST", headers: jsonAuth(), body: JSON.stringify({ lead_id:id, id, reason }) });
  const body = await j(r);
  if(!r.ok) throw new Error(`[${r.status}] ${body?.error||"archive failed"}`);
  return body;
}
async function me(){
  const r = await fetch(API_BASE + "/v1/agents/me", { headers: authHeaders() });
  const body = await j(r);
  if(!r.ok) throw new Error(`[${r.status}] ${body?.error||"me failed"}`);
  return body;
}

/* ---------------- timers & status ---------------- */
const CLAIM_WINDOW_SEC = 600;
function remainingSeconds(it, nowMs){
  const now = Math.floor(nowMs/1000);
  const created = asInt(it.created_ts, 0);
  const server = asInt(it.claim_expires_ts, 0);
  const until = server || (created ? created + CLAIM_WINDOW_SEC : 0);
  return until ? Math.max(0, until - now) : 0;
}
function statusDerived(it, nowMs){
  const base = (it.status||"new").toLowerCase();
  if(base==="new" && remainingSeconds(it, nowMs)===0) return "missed";
  return base;
}
function sameId(a,b){ return String(a||"").toLowerCase()===String(b||"").toLowerCase(); }
function valueOf(it, keys, fallback=""){
  for(const key of keys){
    const value = it && it[key];
    if(value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return fallback;
}
function leadId(it){ return valueOf(it, ["id", "lead_id", "pk", "sk"], ""); }
function leadTitle(it){ return valueOf(it, ["title", "name", "headline", "lead_type", "role"], "(no title)"); }
function leadSummary(it){ return valueOf(it, ["summary", "description", "message", "snippet", "original_text"], ""); }

/* ---------------- Dashboard ---------------- */
export default function Dashboard(){
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [rows, setRows]   = useState([]);
  const [tab, setTab]     = useState("toclaim");
  const [zipq, setZipq]   = useState("");
  const [q, setQ]         = useState("");
  const [nowMs, setNowMs] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let on = true;
    (async()=>{
      try{ const m = await me(); if(on) setAgent(m); }catch{}  // ok if 401
      await refresh();
    })();
    return ()=>{ on=false; };
  },[]);
  useEffect(()=>{ const t=setInterval(()=>setNowMs(Date.now()),1000); return ()=>clearInterval(t); },[]);

  async function refresh(){
    setLoading(true); setErr("");
    try{ const list = await listLeadsTolerant({ limit: 100 }); setRows(Array.isArray(list)?list:[]); }
    catch(e){ setErr(typeof e?.message==="string"? e.message : String(e)); setRows([]); }
    finally{ setLoading(false); }
  }

  const myId = (agent && (agent.id||agent.agent_id||agent.email)) || "";
  function isMine(it){ const owner = it.claimed_by || it.agent_id || it.owner; return owner && myId && sameId(owner, myId); }

  const filtered = useMemo(()=>{
    const z = (zipq||"").trim();
    const qq= (q||"").trim().toLowerCase();
    return rows.filter(it=>{
      const st = statusDerived(it, nowMs);
      if(tab==="toclaim"){
        const claimable = (st==="new" && remainingSeconds(it, nowMs)>0);
        const myopen    = (isMine(it) && st!=="closed" && st!=="missed");
        if(!(claimable || myopen)) return false;
      }else if(tab==="open"){
        if(!(isMine(it) && st!=="closed" && st!=="missed")) return false;
      }else if(tab==="closed"){
        if(st!=="closed") return false;
      }else if(tab==="missed"){
        if(st!=="missed") return false;
      }
      if(z && !String(it.zip||"").startsWith(z)) return false;
      if(qq){
        const hay = `${leadTitle(it)} ${it.email||""} ${leadSummary(it)} ${it.intent||""} ${it.urgency||""} ${it.city||""} ${it.zip||""}`.toLowerCase();
        if(hay.indexOf(qq)===-1) return false;
      }
      return true;
    });
  },[rows, tab, zipq, q, nowMs, agent]);

  async function onClaim(it){
    try{
      setErr("");
      await tryClaimFlex(it);
      await refresh();
    }catch(e){
      setErr("Claim failed: " + (e?.message||e));
    }
  }
  async function onIgnore(it){
    try{ await archiveLead(it, "ignored"); }catch(_){}  // best-effort
    setRows(prev=> prev.filter(x=> (x.id||x.lead_id)!==(it.id||it.lead_id)));
  }
  function pushDeleted(it){
    try{
      const a = JSON.parse(localStorage.getItem("bb_deleted_ring")||"[]");
      a.unshift({ id: it.id||it.lead_id||Math.random().toString(36).slice(2), email: it.email, zip: it.zip, at: Date.now() });
      while(a.length>50) a.pop();
      localStorage.setItem("bb_deleted_ring", JSON.stringify(a));
    }catch{}
  }
  async function onDelete(it){ pushDeleted(it); await onIgnore(it); }
  function openLead(it){
    const id = leadId(it);
    if(id) navigate(`/lead/${encodeURIComponent(id)}`);
  }

  const totals = useMemo(()=>{
    let total=rows.length, high=0, claimed=0, closed=0;
    rows.forEach(it=>{
      const st = statusDerived(it, nowMs);
      if(st==="closed") closed++;
      if(st!=="new" && st!=="missed") claimed++;
      if(asInt(it.score,0)>=80) high++;
    });
    return { total, high, claimed, closed };
  },[rows, nowMs]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2 items-center">
          <input placeholder="ZIP Prefix (e.g., 72)" className="inp" value={zipq} onChange={e=>setZipq(e.target.value)} />
          <input placeholder="Search name/email/zip/message" className="inp md:w-80" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={refresh} disabled={loading}>{loading ? "..." : "Refresh"}</button>
        </div>
      </div>

      {err ? <div className="mb-3 text-sm text-red-600">Error: {err}</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card title="Total Leads" value={totals.total}/>
        <Card title="High Intent" value={totals.high}/>
        <Card title="Claimed" value={totals.claimed}/>
        <Card title="Closed" value={totals.closed}/>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Tab id="toclaim" label="To Claim" cur={tab} setCur={setTab}/>
        <Tab id="open"    label="Open"     cur={tab} setCur={setTab}/>
        <Tab id="closed"  label="Closed"   cur={tab} setCur={setTab}/>
        <Tab id="missed"  label="Missed"   cur={tab} setCur={setTab}/>
        <Tab id="all"     label="All"      cur={tab} setCur={setTab}/>
      </div>

      <div className="table-wrap">
        <table className="w-full table-auto">
          <thead>
            <tr className="t-head">
              <th>Lead</th><th>Intent</th><th>Urgency</th><th>Location</th><th>Max Price</th><th>Score</th><th>Status</th><th>Source</th><th className="t-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={9} className="py-8 text-center text-gray-400">No leads</td></tr>
            ) : filtered.map((it, idx)=>{
              const left = remainingSeconds(it, nowMs);
              const st = statusDerived(it, nowMs);
              const redSoon = st==="new" && left>0 && left<=180;
              const id = leadId(it);
              const summary = leadSummary(it);
              return (
                <tr
                  key={(id||idx)}
                  className="t-row"
                  onClick={()=>openLead(it)}
                  style={{cursor:id ? "pointer" : "default"}}
                >
                  <td>
                    <div className="font-medium text-slate-900">{leadTitle(it)}</div>
                    {summary ? <div className="text-xs text-gray-500 max-w-md truncate">{summary}</div> : null}
                    {it.email? <div className="text-xs text-gray-500">{it.email}</div>:null}
                  </td>
                  <td>{valueOf(it, ["intent"], "")}</td>
                  <td>{valueOf(it, ["urgency"], "")}</td>
                  <td>{[valueOf(it, ["city"], ""), valueOf(it, ["zip"], "")].filter(Boolean).join(" ")}</td>
                  <td>{it.max_price?("$"+it.max_price):""}</td>
                  <td>{asInt(it.score,0) || ""}</td>
                  <td>{st}</td>
                  <td>{it.source||""}</td>
                  <td className="t-right">
                    {st==="new" && left>0 ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className={"mono " + (redSoon ? "text-red-600":"text-gray-500")}>{prettyTimer(left)}</span>
                        <button className="btn btn-blue" onClick={(e)=>{e.stopPropagation(); onClaim(it);}}>Claim</button>
                        <button className="btn btn-ghost" onClick={(e)=>{e.stopPropagation(); onIgnore(it);}}>Ignore</button>
                        <button className="btn btn-ghost" title="Delete (local only)" onClick={(e)=>{e.stopPropagation(); onDelete(it);}}></button>
                      </div>
                    ) : st==="missed" ? (
                      <span className="text-gray-400">missed</span>
                    ) : st==="closed" ? (
                      <span className="text-gray-500">closed</span>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-gray-500">open</span>
                        <button className="btn btn-ghost" title="Delete (local only)" onClick={(e)=>{e.stopPropagation(); onDelete(it);}}></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({title, value}){ return (
  <div className="rounded-xl border border-gray-200 p-4"><div className="text-sm text-gray-500">{title}</div><div className="text-2xl font-semibold">{value}</div></div>
);}
function Tab({id, label, cur, setCur}){
  const active = id===cur;
  return <button onClick={()=>setCur(id)} className={"tab "+(active?"tab-active":"")}>{label}</button>;
}
