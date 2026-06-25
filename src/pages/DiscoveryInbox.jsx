import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

const MARKETS = [
  { label: "Broward FL", value: "broward-fl" },
  { label: "Northwest Arkansas", value: "northwest-ar" },
];

const STATUSES = ["all", "new", "good", "maybe", "rejected", "duplicate", "sent", "archived"];
const ACTIONS = [
  { label: "Good", value: "good" },
  { label: "Maybe", value: "maybe" },
  { label: "Reject", value: "reject" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Archive", value: "archive" },
];

function token() {
  try { return localStorage.getItem("bb_token") || ""; } catch { return ""; }
}

async function parseJson(resp) {
  const text = await resp.text().catch(() => "");
  try { return text ? JSON.parse(text) : null; } catch { return null; }
}

function normalizeItems(body) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  const items = body.items || body.Items || body.candidates || body.results || body.data;
  return Array.isArray(items) ? items : [];
}

function candidateId(candidate) {
  return candidate?.candidate_id || candidate?.id || candidate?.pk || candidate?.sk || "";
}

function candidateStatus(candidate) {
  return String(candidate?.status || "new").toLowerCase();
}

function field(candidate, keys) {
  for (const key of keys) {
    const value = candidate?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function formatDate(value) {
  if (!value) return "";
  const numeric = Number(value);
  const date = Number.isFinite(numeric)
    ? new Date(numeric < 10000000000 ? numeric * 1000 : numeric)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

export default function DiscoveryInbox() {
  const navigate = useNavigate();
  const [marketSlug, setMarketSlug] = useState("broward-fl");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState("");
  const [error, setError] = useState("");

  function handleUnauthorized() {
    try { localStorage.removeItem("bb_token"); } catch {}
    navigate("/login", { replace: true });
  }

  async function refresh() {
    const authToken = token();
    if (!authToken) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/v1/candidates/list?market_slug=${encodeURIComponent(marketSlug)}&limit=50`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` }, mode: "cors" });
      const body = await parseJson(resp);
      if (resp.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!resp.ok) throw new Error(body?.error || body?.message || `Request failed (${resp.status})`);
      setRows(normalizeItems(body));
    } catch (e) {
      setRows([]);
      setError(e?.message || "Unable to load discovery candidates.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [marketSlug]);

  const filteredRows = useMemo(() => {
    if (status === "all") return rows;
    return rows.filter(candidate => candidateStatus(candidate) === status);
  }, [rows, status]);

  async function postAction(candidate, action) {
    const id = candidateId(candidate);
    if (!id) {
      setError("Candidate is missing candidate_id.");
      return;
    }

    const authToken = token();
    if (!authToken) {
      handleUnauthorized();
      return;
    }

    setActingId(`${id}:${action}`);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/v1/candidates/action`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidate_id: id, action }),
        mode: "cors",
      });
      const body = await parseJson(resp);
      if (resp.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!resp.ok) throw new Error(body?.error || body?.message || `Action failed (${resp.status})`);
      await refresh();
    } catch (e) {
      setError(e?.message || "Unable to update candidate.");
    } finally {
      setActingId("");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Discovery Inbox</h1>
          <p className="text-sm text-gray-500">Review real candidate opportunities from the discovery pipeline.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select className="inp" value={marketSlug} onChange={e => setMarketSlug(e.target.value)}>
            {MARKETS.map(market => <option key={market.value} value={market.value}>{market.label}</option>)}
          </select>
          <select className="inp" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="btn" onClick={refresh} disabled={loading || !!actingId}>{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>

      {error ? <div className="mb-3 text-sm text-red-600">Error: {error}</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card title="Market" value={MARKETS.find(m => m.value === marketSlug)?.label || marketSlug} />
        <Card title="Visible Candidates" value={filteredRows.length} />
        <Card title="Loaded" value={rows.length} />
      </div>

      <div className="table-wrap">
        <table className="w-full table-auto">
          <thead>
            <tr className="t-head">
              <th>Candidate</th>
              <th>Market</th>
              <th>Status</th>
              <th>Source</th>
              <th>Found</th>
              <th className="t-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading candidates</td></tr>
            ) : filteredRows.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">No candidates</td></tr>
            ) : filteredRows.map((candidate, index) => {
              const id = candidateId(candidate) || index;
              const sourceUrl = field(candidate, ["source_url", "url", "listing_url", "profile_url"]);
              const title = field(candidate, ["name", "title", "headline", "address", "candidate_name"]) || "Untitled candidate";
              const detail = field(candidate, ["summary", "description", "notes", "email", "phone"]);
              const source = field(candidate, ["source", "source_name", "provider"]);
              const foundAt = field(candidate, ["created_at", "created_ts", "found_at", "updated_at"]);
              return (
                <tr key={id} className="t-row">
                  <td>
                    <div className="font-medium text-slate-900">{title}</div>
                    {detail ? <div className="text-xs text-gray-500 max-w-md truncate">{detail}</div> : null}
                  </td>
                  <td>{field(candidate, ["market_slug", "market"]) || marketSlug}</td>
                  <td>{candidateStatus(candidate)}</td>
                  <td>{source}</td>
                  <td>{formatDate(foundAt)}</td>
                  <td className="t-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {sourceUrl ? (
                        <a className="btn btn-ghost" href={sourceUrl} target="_blank" rel="noreferrer">Open Source</a>
                      ) : (
                        <span className="text-xs text-gray-400">No source</span>
                      )}
                      {ACTIONS.map(action => {
                        const busy = actingId === `${candidateId(candidate)}:${action.value}`;
                        return (
                          <button
                            key={action.value}
                            className={action.value === "good" ? "btn btn-blue" : "btn btn-ghost"}
                            onClick={() => postAction(candidate, action.value)}
                            disabled={!!actingId || loading}
                          >
                            {busy ? "..." : action.label}
                          </button>
                        );
                      })}
                    </div>
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

function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
