import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJSON, postJSON } from "../lib/api";

const CLAIM_WINDOW_SEC = 600;

function fmtDate(ts) {
  if (!ts) return "";
  const d = new Date(Number(ts) * 1000);
  return d.toLocaleDateString("en-US");
}

function remainingSeconds(ts) {
  if (!ts) return 0;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, CLAIM_WINDOW_SEC - (now - Number(ts)));
}

function statusDerived(it) {
  if (it.status === "claimed") return "claimed";
  if (remainingSeconds(it.created_ts) === 0) return "missed";
  return "new";
}

// Pull intent from any existing field the backend may already send.
// If nothing exists, show "—" (no guessing).
function intentValue(it) {
  const v =
    it.intent ??
    it.Intent ??
    it.intent_level ??
    it.lead_intent ??
    it.priority ??
    it.Priority ??
    it.score_intent ??
    it.intent_score ??
    "";
  const s = String(v || "").trim();
  return s ? s : "—";
}

// Pull message/description from likely fields; if none, show blank.
// This is only a preview (table column).
function descriptionPreview(it, maxLen = 90) {
  const raw =
    it.message ??
    it.Message ??
    it.description ??
    it.Description ??
    it.notes ??
    it.body ??
    it.text ??
    it.msg ??
    "";
  const s = String(raw || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > maxLen ? s.slice(0, maxLen - 1) + "…" : s;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [cur, setCur] = useState("new");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await getJSON("/v1/leads/list?limit=100");
      const list = r.items || r.Items || r.leads || [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  async function onClaim(it) {
    await postJSON("/v1/claim", { lead_id: it.lead_id || it.id });
    load();
  }

  async function onDelete(it) {
    if (!confirm("Delete this lead permanently?")) return;
    await postJSON("/v1/leads/delete", { lead_id: it.lead_id || it.id });
    load();
  }

  function onView(it) {
    const id = it.lead_id || it.id;
    if (!id) return;
    navigate(`/lead/${encodeURIComponent(id)}`);
  }

  const derived = items.map((it) => ({
    ...it,
    _status: statusDerived(it),
  }));

  const filtered = derived.filter((it) => it._status === cur);

  const metrics = {
    new: derived.filter((x) => x._status === "new").length,
    claimed: derived.filter((x) => x._status === "claimed").length,
    missed: derived.filter((x) => x._status === "missed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="To Claim" value={metrics.new} />
        <Card title="Claimed" value={metrics.claimed} />
        <Card title="Missed" value={metrics.missed} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Tab id="new" label="To Claim" cur={cur} setCur={setCur} />
        <Tab id="claimed" label="Claimed" cur={cur} setCur={setCur} />
        <Tab id="missed" label="Missed" cur={cur} setCur={setCur} />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">ZIP</th>

              {/* NEW columns */}
              <th className="p-2 text-left">Intent</th>
              <th className="p-2 text-left">Description</th>

              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const secs = remainingSeconds(it.created_ts);
              const redSoon = secs > 0 && secs < 120;
              const id = it.lead_id || it.id;

              return (
                <tr
                  key={id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => onView(it)}
                  title="View lead details"
                >
                  <td className="p-2">{fmtDate(it.created_ts)}</td>
                  <td className="p-2">{it.email || "(no email)"}</td>
                  <td className="p-2">{it.zip || ""}</td>

                  {/* NEW columns */}
                  <td className="p-2">{intentValue(it)}</td>
                  <td className="p-2 text-gray-600">
                    {descriptionPreview(it) || <span className="text-gray-300">—</span>}
                  </td>

                  <td className="p-2">
                    <span
                      className={
                        "mono " + (redSoon ? "text-red-600" : "text-gray-500")
                      }
                    >
                      {it._status}
                    </span>
                  </td>
                  <td className="p-2 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-ghost" onClick={() => onView(it)}>
                      View
                    </button>

                    {it._status === "new" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => onClaim(it)}
                      >
                        Claim
                      </button>
                    )}

                    <button className="btn btn-ghost" onClick={() => onDelete(it)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  {loading ? "Loading…" : "No leads"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Tab({ id, label, cur, setCur }) {
  const active = id === cur;
  return (
    <button
      onClick={() => setCur(id)}
      className={
        "px-3 py-1 rounded-lg border " +
        (active ? "bg-blue-600 text-white" : "bg-white")
      }
    >
      {label}
    </button>
  );
}
