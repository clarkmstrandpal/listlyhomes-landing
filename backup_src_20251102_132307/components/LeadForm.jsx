import React from "react";
import { postJSON } from "../lib/api";

export default function LeadForm({ compact=false }){
  const [form, setForm] = React.useState({
    role: "buy",            // buy | sell | rent | listrental
    name: "", email: "", phone: "", zip: "", price: "", notes: ""
  });
  const [msg, setMsg] = React.useState("");

  const on = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }));

  async function submit(e){
    e?.preventDefault?.();
    setMsg("Submitting");
    try{
      await postJSON("/v1/ingest", {
        source: "landing",
        intent: form.role,  // maps your pipeline later
        name: form.name, email: form.email, phone: form.phone,
        zip: form.zip, max_price: form.price, notes: form.notes
      });
      setMsg("Thanks! Well be in touch shortly.");
      setForm({ role:"buy", name:"", email:"", phone:"", zip:"", price:"", notes:"" });
    }catch(err){
      setMsg(err?.data?.error || "Submission failed");
    }
  }

  return (
    <form onSubmit={submit} className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
      <select className="border border-gray-300 rounded-lg px-3 py-2" value={form.role} onChange={on("role")}>
        <option value="buy">Im buying</option>
        <option value="sell">Im selling</option>
        <option value="rent">Im looking to rent</option>
        <option value="listrental">I want to rent out my property</option>
      </select>
      <input className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Full name" value={form.name} onChange={on("name")} />
      <input className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Email" value={form.email} onChange={on("email")} />
      <input className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Phone" value={form.phone} onChange={on("phone")} />
      <input className="border border-gray-300 rounded-lg px-3 py-2" placeholder="ZIP" value={form.zip} onChange={on("zip")} />
      <input className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Max price $" value={form.price} onChange={on("price")} />
      <textarea className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2" rows="4" placeholder="Neighborhoods, timing, pre-approval, must-haves" value={form.notes} onChange={on("notes")} />
      <div className="md:col-span-2">
        <button className="btn-primary w-full md:w-auto">Submit</button>
        {msg && <span className="ml-3 text-sm text-slate-600">{msg}</span>}
      </div>
    </form>
  );
}
