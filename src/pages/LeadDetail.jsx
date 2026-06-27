import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { closeLead, listLeads } from "../lib/api";

function normalizeList(body) {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  const arr = body.Items || body.items || body.leads || body.results || body.data;
  if (Array.isArray(arr)) return arr;
  if (typeof body === "object") return Object.values(body);
  return [];
}

function valueOf(lead, keys, fallback = "Not provided") {
  for (const key of keys) {
    const value = lead && lead[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return fallback;
}

function leadId(lead) {
  return valueOf(lead, ["id", "lead_id", "pk", "sk"], "");
}

function sameId(a, b) {
  return String(a || "").toLowerCase() === String(b || "").toLowerCase();
}

function formatDate(value) {
  if (!value || value === "Not provided") return "Not provided";
  const numeric = Number(value);
  const date = Number.isFinite(numeric)
    ? new Date(numeric < 10000000000 ? numeric * 1000 : numeric)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function fallbackReply(lead) {
  const summary = valueOf(lead, ["summary", "description", "message", "snippet"], "");
  const city = valueOf(lead, ["city"], "");
  const source = valueOf(lead, ["source"], "");
  const place = city ? ` in ${city}` : "";
  const origin = source ? ` from your ${source} post` : "";
  const context = summary ? ` It sounds like ${summary}` : "";
  return `Hi, I saw your request${origin}${place}.${context} Are you still looking for help? I would be glad to connect and see if I can point you in the right direction.`;
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (_) {
      // Fall back for HTTP beta sites where Clipboard API is blocked.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command was not accepted.");
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function LeadDetail() {
  const { id } = useParams();
  const wantedId = useMemo(() => {
    try { return decodeURIComponent(id || ""); } catch { return id || ""; }
  }, [id]);

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [closing, setClosing] = useState(false);

  async function refresh() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const body = await listLeads({ limit: 100 });
      const rows = normalizeList(body);
      const match = rows.find(item => sameId(leadId(item), wantedId));
      if (!match) throw new Error("Lead was not found in the current approved lead list.");
      setLead(match);
    } catch (e) {
      setLead(null);
      setError(e?.message || "Unable to load this lead.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [wantedId]);

  const suggestedReply = useMemo(() => {
    if (!lead) return "";
    return valueOf(lead, ["suggested_reply"], "") || fallbackReply(lead);
  }, [lead]);

  async function copyReply() {
    try {
      await copyText(suggestedReply);
      setError("");
      setNotice("Suggested reply copied.");
    } catch (e) {
      setNotice("");
      setError(`Could not copy automatically. Select the suggested reply text and copy it manually.${e?.message ? ` (${e.message})` : ""}`);
    }
  }

  async function onCloseLead() {
    if (!lead) return;
    const idToClose = leadId(lead);
    if (!idToClose) {
      setError("This lead is missing an id, so it cannot be closed.");
      return;
    }
    setClosing(true);
    setError("");
    setNotice("");
    try {
      await closeLead(idToClose, "nosale");
      setLead(prev => prev ? { ...prev, status: "closed" } : prev);
      setNotice("Lead closed.");
    } catch (e) {
      setError(e?.message || "Unable to close this lead.");
    } finally {
      setClosing(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-8 text-gray-600">Loading lead details...</div>;
  }

  if (error && !lead) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/dashboard" className="text-sm text-blue-600">Back to dashboard</Link>
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  const title = valueOf(lead, ["title", "name", "headline"], "Lead detail");
  const sourceUrl = valueOf(lead, ["source_url", "url", "listing_url", "profile_url"], "");
  const originalText = valueOf(lead, ["original_text", "message", "snippet"], "No original text was included with this lead.");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Link to="/dashboard" className="text-sm text-blue-600">Back to dashboard</Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
          <div className="mt-1 text-sm text-gray-500">ListlyHomes lead</div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {sourceUrl ? (
            <a className="btn btn-blue" href={sourceUrl} target="_blank" rel="noreferrer">Open Original Post</a>
          ) : (
            <button className="btn btn-ghost" disabled>Open Original Post</button>
          )}
          <button className="btn btn-ghost" onClick={copyReply}>Copy Suggested Reply</button>
          <button className="btn btn-ghost" onClick={() => setNotice("Mark Contacted is a placeholder until a backend endpoint exists.")}>Mark Contacted</button>
          <button className="btn btn-ghost" onClick={onCloseLead} disabled={closing}>{closing ? "Closing..." : "Close Lead"}</button>
        </div>
      </div>

      {notice ? <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">{notice}</div> : null}
      {error ? <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Error: {error}</div> : null}

      <div className="grid gap-3 md:grid-cols-4 mb-6">
        <Field label="Lead type / role" value={valueOf(lead, ["lead_type", "role"])} />
        <Field label="Intent" value={valueOf(lead, ["intent"])} />
        <Field label="Urgency" value={valueOf(lead, ["urgency"])} />
        <Field label="Vertical" value={valueOf(lead, ["vertical"])} />
        <Field label="Market" value={valueOf(lead, ["market", "market_slug"])} />
        <Field label="City" value={valueOf(lead, ["city"])} />
        <Field label="ZIP" value={valueOf(lead, ["zip"])} />
        <Field label="Source" value={valueOf(lead, ["source"])} />
        <Field label="Source post date" value={formatDate(valueOf(lead, ["source_post_date", "post_date", "created_at", "created_ts"]))} />
      </div>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Summary</h2>
        <p className="mt-2 whitespace-pre-wrap text-slate-800">{valueOf(lead, ["summary", "description"], "No summary was included with this lead.")}</p>
      </section>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Suggested Reply</h2>
          <button className="btn btn-ghost" onClick={copyReply}>Copy</button>
        </div>
        <p className="whitespace-pre-wrap text-slate-800">{suggestedReply}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Original Text</h2>
        <p className="mt-2 whitespace-pre-wrap text-slate-800">{originalText}</p>
        <div className="mt-4 text-sm text-gray-500">
          Source URL: {sourceUrl ? <a className="text-blue-600" href={sourceUrl} target="_blank" rel="noreferrer">{sourceUrl}</a> : "Not provided"}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value || "Not provided"}</div>
    </div>
  );
}
