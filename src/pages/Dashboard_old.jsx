import React, { useEffect, useMemo, useState } from "react";
import { listLeads, claimLead, archiveLead, closeLead, reopenLead, me } from "../lib/api";

const CLAIM_WINDOW_SEC = 600; // 10 minutes
const WARN_SEC = 180;         // turn red under 3 minutes

function useNowSec() {
  const [now, setNow] = useState(() => Math.floor(Date.now()/1000));
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now()/1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function mmss(sec) {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec/60).toString().padStart(2,"0");
  const s = Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  const [tab, setTab] = useState("toclaim"); // toclaim | open | closed | missed | all
  const [zipPrefix, setZipPrefix] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const now = useNowSec();

  // who am i (for avatar + welcome)
  useEffect(() => {
    me().then(setUser).catch(()=>{});
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const res = await listLeads({ zip_prefix: zipPrefix || undefined, q: q || undefined });
      let arr = [];
      if (Array.isArray(res)) arr = res;
      else if (res?.Items) arr = res.Items;
      else if (res?.items) arr = res.items;
      else if (res) arr = [res];
      setItems(arr);
    } catch(e){
      console.error("listLeads failed", e);
      alert(e.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []); // initial

  const counts = useMemo(() => {
    const total = items.length;
    const high  = items.filter(x => Number(x.score||0) >= 80).length;
    const claimed = items.filter(x => x.status === "open" || x.claimed_by).length;
    const closed  = items.filter(x => x.status === "closed").length;
    return { total, high, claimed, closed };
  }, [items]);

  const list = useMemo(() => {
    const createdSort = (a,b) => (Number(b.created_ts||0) - Number(a.created_ts||0));
    let arr = [...items];
    // tab filter
    if (tab === "toclaim") arr = arr.filter(x => x.status === "new");
    else if (tab === "open") arr = arr.filter(x => x.status === "open");
    else if (tab === "closed") arr = arr.filter(x => x.status === "closed");
    else if (tab === "missed") arr = arr.filter(x => x.status === "missed" || x.archived === true);
    // search
    const needle = q.trim().toLowerCase();
    if (needle) {
      arr = arr.filter(x => {
        const s = [
          x.name, x.first_name, x.last_name, x.email, x.phone, x.zip, x.message, x.source
        ].map(v => (v||"").toString().toLowerCase()).join(" ");
        return s.includes(needle);
      });
    }
    // zip prefix
    if (zipPrefix) {
      arr = arr.filter(x => (x.zip||"").toString().startsWith(zipPrefix));
    }
    return arr.sort(createdSort);
  }, [items, tab, q, zipPrefix]);

  function remainingSec(it){
    const cts = Number(it.created_ts || 0);
    if (!cts) return 0;
    return CLAIM_WINDOW_SEC - (now - cts);
  }

  async function doClaim(it){
    try{
      await claimLead(it.id);
      await refresh();
    }catch(e){
      alert(e.message || "Claim failed");
    }
  }
  async function doArchive(it){
    try{
      await archiveLead(it.id);
      await refresh();
    }catch(e){
      alert(e.message || "Archive failed");
    }
  }
  async function doClose(it, outcome){
    try{
      await closeLead(it.id, outcome); // "sale" | "nosale"
      await refresh();
    }catch(e){
      alert(e.message || "Close failed");
    }
  }

  const avatar = (user?.email || "U").slice(0,1).toUpperCase();

  return (
    <div className="bb-wrap">

      {/* Side overlay for mobile */}
      <div
        className={"bb-side-overlay" + (sideOpen ? " open" : "")}
        onClick={() => setSideOpen(false)}
      />

      {/* Side nav */}
      <aside className={"bb-side" + (sideOpen ? " open" : "")}>
        <div className="bb-side-header">
          <div className="bb-avatar">{avatar}</div>
          <div className="bb-user">
            <div className="bb-user-name">{user?.first_name ? `${user.first_name} ${user?.last_name||""}`.trim() : "Logged in"}</div>
            <div className="bb-user-email">{user?.email || ""}</div>
          </div>
        </div>
        <nav className="bb-side-nav">
          <a href="#/dashboard" className="active">Leads</a>
          <a href="#/dashboard?view=metrics">Metrics</a>
          <a href="#/dashboard?view=settings">Settings</a>
          <a href="#/logout" onClick={(e)=>{ e.preventDefault(); localStorage.removeItem("bb_token"); window.location.hash="#/login"; window.location.reload(); }}>Log out</a>
        </nav>
        <div className="bb-side-footer"> BuyerBoard</div>
      </aside>

      {/* Top bar */}
      <div className="bb-topbar">
        <button className="bb-burger" aria-label="Open menu" onClick={()=>setSideOpen(true)}>
          <span/><span/><span/>
        </button>
        <h1 className="bb-title">Dashboard</h1>
        <div className="bb-top-actions">
          <button className="bb-btn" onClick={refresh} disabled={loading}>Refresh</button>
        </div>
      </div>

      {/* Metric cards */}
      <section className="bb-metrics">
        <div className="bb-card"><div className="bb-label">Total Leads</div><div className="bb-value">{counts.total}</div></div>
        <div className="bb-card"><div className="bb-label">High Intent</div><div className="bb-value">{counts.high}</div></div>
        <div className="bb-card"><div className="bb-label">Claimed</div><div className="bb-value">{counts.claimed}</div></div>
        <div className="bb-card"><div className="bb-label">Closed</div><div className="bb-value">{counts.closed}</div></div>
        <div className="bb-card"><div className="bb-label">Reply Rate</div><div className="bb-value">0%</div></div>
      </section>

      {/* Tabs + filters */}
      <section className="bb-filters">
        <div className="bb-tabs">
          <button className={tab==="toclaim"?"active":""} onClick={()=>setTab("toclaim")}>To Claim</button>
          <button className={tab==="open"?"active":""} onClick={()=>setTab("open")}>Open</button>
          <button className={tab==="closed"?"active":""} onClick={()=>setTab("closed")}>Closed</button>
          <button className={tab==="missed"?"active":""} onClick={()=>setTab("missed")}>Missed</button>
          <button className={tab==="all"?"active":""} onClick={()=>setTab("all")}>All</button>
        </div>
        <div className="bb-searches">
          <input placeholder="ZIP Prefix (e.g., 72)" value={zipPrefix} onChange={e=>setZipPrefix(e.target.value.replace(/[^0-9]/g,''))} />
          <input placeholder="Search name/email/zip/message" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="bb-btn" onClick={refresh} disabled={loading}>Refresh</button>
        </div>
      </section>

      {/* Table */}
      <section className="bb-table">
        <table>
          <thead>
          <tr>
            <th>Buyer</th><th>ZIP</th><th>Max Price</th><th>Beds</th><th>Baths</th><th>Score</th><th>Status</th><th>Source</th><th className="t-center">Timer</th><th className="t-right">Actions</th>
          </tr>
          </thead>
          <tbody>
          {list.length === 0 && (
            <tr><td colSpan="10" className="t-center muted">No leads</td></tr>
          )}
          {list.map((it) => {
            const remain = remainingSec(it);
            const warn = remain > 0 && remain <= WARN_SEC;
            const showClaim = it.status === "new" && remain > 0;
            return (
              <tr key={it.id}>
                <td>
                  <div className="buyer-name">{it.name || `${it.first_name||""} ${it.last_name||""}`.trim() || "(no name)"}</div>
                  <div className="muted">{it.email || ""}</div>
                </td>
                <td>{it.zip || ""}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{Number(it.score||0)}</td>
                <td>{it.status || ""}</td>
                <td>{it.source || ""}</td>
                <td className={"t-center countdown" + (warn ? " warn" : "")}>
                  {it.status==="new" ? mmss(remain) : ""}
                </td>
                <td className="t-right">
                  {showClaim && (
                    <>
                      <button className="bb-btn primary" onClick={()=>doClaim(it)}>Claim</button>
                      <button className="bb-icon" title="Archive" onClick={()=>doArchive(it)}></button>
                    </>
                  )}
                  {it.status==="open" && (
                    <div className="bb-close">
                      <button className="bb-btn" onClick={()=>doClose(it,"sale")}>Close  Sale</button>
                      <button className="bb-btn" onClick={()=>doClose(it,"nosale")}>Close  No Sale</button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
