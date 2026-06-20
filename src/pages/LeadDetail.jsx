import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJSON, postJSON } from "../lib/api";

function isUrl(s) {
  try {
    const u = new URL(String(s));
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function pickMessage(it) {
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
  return String(raw || "").trim();
}

function pickSource(it) {
  return (
    it.source ??
    it.Source ??
    it.platform ??
    it.channel ??
    it.origin ??
    it.provenance ??
    ""
  );
}

function pickSourceUrl(it) {
  const v =
    it.source_url ??
    it.sourceUrl ??
    it.url ??
    it.link ??
    it.permalink ??
    it.post_url ??
    it.postUrl ??
    "";
  const s = String(v || "").trim();
  return s && isUrl(s) ? s : "";
}

function fmtTs(ts) {
  if (!ts) return "";
  const d = new Date(Number(ts) * 1000);
  return d.toLocaleString("en-US");
}

function Field({ label, value }) {
  const v = value === null || value === undefined ? "" : String(value);
  return (
    <div className="rounded-xl border border-gray-200 p-3 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm break-words">{v || <span className="text-gray-300">—</span>}</div>
    </div>
  );
}

export default function LeadDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const decodedId = useMemo(() => {
    try {
      return decodeURIComponent(id || "");
    } catch {
      return id || "";
    }
  }, [id]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      // No backend changes: reuse list endpoint and find the lead by id.
      const r = await getJSON("/v1/leads/list?limit=100");
      const list = r.items || r.Items || r.leads || [];
      setItems(list);
    } catch (e) {
      setErr("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [decodedId]);

  const lead = useMemo(() => {
    const target = String(decodedId || "");
    return (items || []).find((x) => String(x.lead_id || x.id || "") === target) || null;
  }, [items, decodedId]);

  async function onClaim() {
    if (!lead) return;
    await postJSON("/v1/claim", { lead_id: lead.lead_id || lead.id });
    await load();
  }

  async function onDelete() {
    if (!lead) return;
    if (!confirm("Delete this lead permanently?")) return;
    await postJSON("/v1/leads/delete", { lead_id: lead.lead_id || lead.id });
    nav("/dashboard");
  }

  const source = lead ? pickSource(lead) : "";
  const sourceUrl = lead ? pickSourceUrl(lead) : "";
  const message = lead ? pickMessage(lead) : "";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Lead Details</div>
          <div className="text-lg font-semibold break-all">{decodedId}</div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => nav("/dashboard")}>
            Back
          </button>

          {lead && (lead.status !== "claimed") && (
            <button className="btn btn-primary" onClick={onClaim}>
              Claim
            </button>
          )}

          {lead && (
            <button className="btn btn-ghost" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-gray-400">Loading…</div>
      )}

      {!loading && err && (
        <div className="text-red-600">{err}</div>
      )}

      {!loading && !lead && !err && (
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="text-sm text-gray-600">
            Lead not found in the current list (limit=100).
          </div>
          <div className="text-xs text-gray-400 mt-1">
            If this becomes common, we can add a client-side “load more” loop without touching the backend.
          </div>
        </div>
      )}

      {lead && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Created" value={fmtTs(lead.created_ts)} />
            <Field label="Status" value={lead.status || "new"} />
            <Field label="ZIP" value={lead.zip || ""} />

            <Field label="Email" value={lead.email || ""} />
            <Field label="Phone" value={lead.phone || lead.mobile || ""} />
            <Field label="Name" value={lead.name || lead.full_name || lead.fullName || ""} />

            <Field label="Role" value={lead.role || lead.intent_role || ""} />
            <Field label="City" value={lead.city || ""} />
            <Field label="State" value={lead.state || ""} />
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-2">
            <div className="text-sm font-semibold">Source</div>
            <div className="text-sm text-gray-700">
              {source || <span className="text-gray-300">—</span>}
            </div>

            {sourceUrl ? (
              <a
                className="text-sm text-blue-600 underline break-all"
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {sourceUrl}
              </a>
            ) : (
              <div className="text-xs text-gray-300">—</div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-2">
            <div className="text-sm font-semibold">Message</div>
            <pre className="text-sm whitespace-pre-wrap break-words text-gray-700">
              {message || "—"}
            </pre>
          </div>

          <details className="rounded-xl border border-gray-200 p-4 bg-white">
            <summary className="cursor-pointer text-sm font-semibold">
              Raw JSON
            </summary>
            <pre className="mt-3 text-xs whitespace-pre-wrap break-words text-gray-700">
              {JSON.stringify(lead, null, 2)}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}
