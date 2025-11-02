import { useMemo, useRef, useState } from "react";
import { postJSON, API_BASE } from "../lib/api";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const MOCK_MODE = !API_BASE; // auto-mock when no API base

const bedsOptions = [1,2,3,4,5];
const bathsOptions = [1,1.5,2,2.5,3,3.5,4];

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    zip: "", maxPrice: "",
    beds: "", baths: "",
    notes: "", consent: false,
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const abortRef = useRef();

  const isValid = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneOk = form.phone.trim().length >= 7;
    const zipOk = /^\d{5}$/.test(form.zip);
    const priceOk = /^\d+$/.test(form.maxPrice) && Number(form.maxPrice) > 0;
    const bedsOk = !!form.beds;
    const bathsOk = !!form.baths;
    const nameOk = form.name.trim().length >= 2;
    return emailOk && phoneOk && zipOk && priceOk && bedsOk && bathsOk && nameOk && form.consent;
  }, [form]);

  function update(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setStatus({ state: "loading", msg: "" });

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const payload = {
      source: "landing-form",
      lead: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        zip: form.zip,
        price_max: Number(form.maxPrice),
        beds: Number(form.beds),
        baths: Number(form.baths),
        notes: form.notes || "",
        ts: new Date().toISOString(),
      }
    };

    try {
      if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 700));
        setStatus({ state: "success", msg: "Lead received (mock)." });
      } else {
        await postJSON("/v1/ingest", payload, abortRef.current.signal);
        setStatus({ state: "success", msg: "Thanks! We’ll match you to the right agent." });
      }
      setForm({ name:"", email:"", phone:"", zip:"", maxPrice:"", beds:"", baths:"", notes:"", consent:false });
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Failed to submit." });
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 md:p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Text label="Full name" value={form.name} onChange={v=>update("name", v)} placeholder="Jane Smith" />
          <Text label="Email" type="email" value={form.email} onChange={v=>update("email", v)} placeholder="jane@company.com" />
          <Text label="Phone" value={form.phone} onChange={v=>update("phone", v)} placeholder="555-123-4567" />
          <Text label="ZIP" value={form.zip} onChange={v=>update("zip", v.replace(/[^0-9]/g,''))} placeholder="73301" maxLength={5} />
          <Text label="Max price ($)" value={form.maxPrice} onChange={v=>update("maxPrice", v.replace(/[^0-9]/g,''))} placeholder="450000" />
          <Select label="Beds" value={form.beds} onChange={v=>update("beds", v)} options={bedsOptions.map(n=>({label:`${n}+`, value:String(n)}))} />
          <Select label="Baths" value={form.baths} onChange={v=>update("baths", v)} options={bathsOptions.map(n=>({label:String(n), value:String(n)}))} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={3}
              placeholder="Neighborhoods, timing, pre-approval, must-haves…"
              value={form.notes}
              onChange={e=>update("notes", e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={form.consent} onChange={e=>update("consent", e.target.checked)} />
          <span>I agree to be contacted by an agent about this request. Message/data rates may apply. I can opt out anytime.</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isValid || status.state === "loading"}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {status.state === "loading" ? (
              // simple spinner without extra deps
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
            ) : null}
            Submit
          </button>
          {status.state === "success" && (
            <span className="inline-flex items-center gap-2 text-green-600 text-sm">
              {/* check icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              {status.msg}
            </span>
          )}
          {status.state === "error" && (
            <span className="inline-flex items-center gap-2 text-red-600 text-sm">
              {/* alert icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              {status.msg}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400">POST {(API_BASE || "(mock)")} /v1/ingest</p>
      </form>
    </div>
  );
}

function Text({ label, value, onChange, type="text", placeholder="", maxLength }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={value}
        onChange={e=>onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map(o=>(
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
