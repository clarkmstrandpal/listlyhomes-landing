// src/pages/Dashboard.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { listLeads, claimLead } from "../lib/api";
import { fetchLeadsSummary } from "../lib/summary";
import FiltersDrawer from "../components/FiltersDrawer";
import { motion } from "framer-motion";
import useUrlState from "../hooks/useUrlState";

const PAGE_SIZE = 24;

function TopBarLoader({ active }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className={`h-0.5 transition-all duration-300 ${active ? "w-full" : "w-0"} bg-black`} />
    </div>
  );
}

function Toast({ toast, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, toast.duration ?? 3000);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  const tone = toast.type === "error" ? "bg-red-600" : toast.type === "success" ? "bg-emerald-600" : "bg-slate-800";
  return (
    <div className={`${tone} text-white shadow-lg rounded-xl px-4 py-3 pointer-events-auto max-w-sm`}>
      <div className="font-semibold">{toast.title}</div>
      {toast.message ? <div className="text-sm opacity-90">{toast.message}</div> : null}
    </div>
  );
}
function ToastHost({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => <Toast key={t.id} toast={t} onDone={() => remove(t.id)} />)}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border p-4 shadow-sm animate-pulse bg-white">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-10 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-40 bg-gray-200 rounded mt-3" />
          <div className="h-3 w-56 bg-gray-200 rounded mt-2" />
          <div className="h-8 w-20 bg-gray-200 rounded mt-4" />
        </div>
      ))}
    </div>
  );
}

function normalizeListResponse(data) {
  if (Array.isArray(data)) return { items: data, next_cursor: null };
  const items = data.items ?? data.leads ?? [];
  const next_cursor = data.next_cursor ?? data.LastEvaluatedKey ?? null;
  return { items, next_cursor };
}
function toServerParams(filters, extra = {}) {
  const params = { ...extra };
  if (filters.zip) params.zip = filters.zip;
  if (filters.zipPrefix) params.zip_prefix = filters.zipPrefix;
  if (filters.minPrice) params.min_price = filters.minPrice;
  if (filters.maxPrice) params.max_price = filters.maxPrice;
  if (filters.status) params.status = filters.status;
  return params;
}

function LeadCard({ lead, onClaim, claiming }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="rounded-2xl border p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg bg-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold truncate max-w-[70%]">{lead.name ?? "Buyer"}</div>
        <span className="text-sm text-gray-500">{lead.zip ?? "-"}</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {lead.price ? `$${Number(lead.price).toLocaleString()}` : "â€”"} Â· {lead.beds ?? "?"} bd Â· {lead.baths ?? "?"} ba
      </div>
      {lead.email && <div className="text-sm text-gray-600 truncate">{lead.email}</div>}
      <div className="mt-3 flex items-center gap-2">
        {!lead.claimed && lead.status !== "claimed" ? (
          <button onClick={() => onClaim(lead.lead_id || lead.id)} disabled={claiming}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
              claiming ? "bg-blue-300 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            {claiming ? "Claimingâ€¦" : "Claim"}
          </button>
        ) : (
          <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Claimed âœ”</span>
        )}
        <span className={`ml-auto inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            (lead.claimed || lead.status === "claimed") ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
          }`}>
          {(lead.claimed || lead.status === "claimed") ? "claimed" : "new"}
        </span>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { state: urlFilters, setState: setUrlFilters } = useUrlState({
    zip: "", zipPrefix: "", minPrice: "", maxPrice: "", status: "",
  });
  const [filters, setFilters] = useState(urlFilters);
  const [leads, setLeads] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [claimingId, setClaimingId] = useState(null);
  const [summary, setSummary] = useState({ new: 0, claimed: 0, archived: 0 });

  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  const pushToast = useCallback((t) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => prev.concat([{ id, ...t }]));
  }, []);
  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  useEffect(() => setUrlFilters(filters), [filters, setUrlFilters]);

  const buildParams = useCallback((extra = {}) => toServerParams(filters, { limit: PAGE_SIZE, ...extra }), [filters]);

  const refreshSummary = useCallback(async () => {
    try {
      const res = await fetchLeadsSummary(toServerParams(filters));
      const sc = res?.status_counts || {};
      setSummary({
        new: Number(sc.new || 0),
        claimed: Number(sc.claimed || 0),
        archived: Number(sc.archived || 0),
      });
    } catch (e) {
      // silent fail for chips
    }
  }, [filters]);

  const loadFirst = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listLeads(buildParams());
      const { items, next_cursor } = normalizeListResponse(res);
      setLeads(items);
      setCursor(next_cursor || null);
      pushToast({ type: "success", title: "Leads loaded", message: `${items.length} results` });
    } catch (e) {
      pushToast({ type: "error", title: "Failed to load", message: e?.message || "Try again." });
    } finally {
      setLoading(false);
    }
  }, [buildParams, pushToast]);

  const loadMore = useCallback(async () => {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await listLeads(buildParams({ cursor }));
      const { items, next_cursor } = normalizeListResponse(res);
      setLeads((prev) => prev.concat(items));
      setCursor(next_cursor || null);
      pushToast({ type: "success", title: "More leads", message: `+${items.length} added`, duration: 2000 });
    } catch (e) {
      pushToast({ type: "error", title: "Load more failed", message: e?.message || "Try again." });
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, buildParams, pushToast]);

  async function onClaim(leadId) {
    try {
      setClaimingId(leadId);
      const res = await claimLead(leadId);
      if (res?.ok || res?.status === "claimed") {
        setLeads((prev) => prev.map((l) => (l.lead_id === leadId || l.id === leadId ? { ...l, status: "claimed", claimed: true } : l)));
        pushToast({ type: "success", title: "Lead claimed", message: `Lead ${leadId} claimed.` });
        refreshSummary(); // keep chips in sync
      } else {
        throw new Error(res?.message || "Claim failed");
      }
    } catch (e) {
      pushToast({ type: "error", title: "Claim failed", message: e?.message || "Try again." });
    } finally {
      setClaimingId(null);
    }
  }

  // Initial load & filter changes
  useEffect(() => {
    const t = setTimeout(() => { loadFirst(); refreshSummary(); }, 250);
    return () => clearTimeout(t);
  }, [filters.zip, filters.zipPrefix, filters.minPrice, filters.maxPrice, filters.status, loadFirst, refreshSummary]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (filters.zip && !(l.zip || "").includes(filters.zip)) return false;
      if (filters.zipPrefix && !(String(l.zip ?? "").startsWith(filters.zipPrefix))) return false;
      if (filters.minPrice && Number(l.price ?? 0) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && Number(l.price ?? 0) > Number(filters.maxPrice)) return false;
      if (filters.status === "new" && (l.claimed || l.status === "claimed")) return false;
      if (filters.status === "claimed" && !(l.claimed || l.status === "claimed")) return false;
      return true;
    });
  }, [leads, filters]);

  return (
    <div className="p-4">
      <TopBarLoader active={loading || loadingMore} />
      <FiltersDrawer filters={filters} setFilters={setFilters} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex items-center gap-2">
          {/* Chips from summary */}
          <button onClick={() => setFilters((f) => ({ ...f, status: "" }))}
            className={`rounded-full px-3 py-1.5 text-sm border ${filters.status === "" ? "bg-brand text-brand-foreground border-slate-900" : "bg-white hover:bg-slate-50"}`}>
            All {summary.new + summary.claimed + summary.archived}
          </button>
          <button onClick={() => setFilters((f) => ({ ...f, status: "new" }))}
            className={`rounded-full px-3 py-1.5 text-sm border ${filters.status === "new" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
            New {summary.new}
          </button>
          <button onClick={() => setFilters((f) => ({ ...f, status: "claimed" }))}
            className={`rounded-full px-3 py-1.5 text-sm border ${filters.status === "claimed" ? "bg-brand text-brand-foreground border-emerald-600" : "bg-white hover:bg-slate-50"}`}>
            Claimed {summary.claimed}
          </button>
          <button onClick={() => setFilters((f) => ({ ...f, status: "archived" }))}
            className={`rounded-full px-3 py-1.5 text-sm border ${filters.status === "archived" ? "bg-slate-800 text-white border-slate-800" : "bg-white hover:bg-slate-50"}`}>
            Archived {summary.archived}
          </button>
        </div>
      </div>

      {/* Quick inline ZIP Prefix input */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xs text-gray-600">ZIP Prefix</div>
        <input value={filters.zipPrefix || ""} onChange={(e) => setFilters((f) => ({ ...f, zipPrefix: e.target.value }))}
          placeholder="e.g., 727" className="w-28 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        <div className="ml-auto text-sm text-gray-500">
          Showing <span className="font-medium">{filteredLeads.length}</span>{leads.length ? ` of ${leads.length}` : ""}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.lead_id || lead.id} lead={lead}
                onClaim={onClaim} claiming={claimingId === (lead.lead_id || lead.id)} />
            ))}
          </motion.div>

          <div className="flex justify-center py-6">
            {cursor ? (
              <button onClick={loadMore} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 active:scale-[0.99] transition disabled:opacity-60" disabled={loadingMore}>
                {loadingMore ? "Loadingâ€¦" : "Load more"}
              </button>
            ) : (
              <div className="text-sm text-gray-400">End of results</div>
            )}
          </div>

          {!filteredLeads.length && (
            <div className="col-span-full text-gray-500">No leads match your filters.</div>
          )}
        </>
      )}

      <ToastHost toasts={toasts} remove={removeToast} />
    </div>
  );
}
