import React from "react";
import Header from "../components/Header.jsx";
import LeadForm from "../components/LeadForm.jsx";

function Card({title, price, desc, cta, highlight, children}){
  return (
    <div className={`card shadow-soft p-6 rounded-2xl border ${highlight ? "ring-2 ring-blue-500" : ""}`}>
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-2 text-3xl font-extrabold">{price}</div>
      <p className="mt-2 text-slate-600">{desc}</p>
      {children}
      <div className="mt-4">
        <a href="#/pricing" className="btn-primary w-full inline-flex">{cta}</a>
      </div>
    </div>
  );
}

export default function Pricing(){
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Choose your package</h1>
        <p className="text-slate-600 mt-2">You can start with per-ZIP routing or talk to us about exclusivity.</p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card
            title="$50 / ZIP"
            price="$50 / mo"
            desc="Get matched to buyers/sellers in selected ZIPs. Simple, month-to-month."
            cta="Start with this"
            highlight
          >
            <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
              <li>Zip-routed leads (non-exclusive)</li>
              <li>Pause anytime</li>
              <li>Email delivery or API</li>
            </ul>
          </Card>

          <Card
            title="Exclusive Rights"
            price="from $1,000+"
            desc="One agent/broker per ZIP. Price varies by high-intent volume."
            cta="Contact for exclusivity"
          >
            <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
              <li>First-come, first-served</li>
              <li>Active subscribers in that ZIP stop receiving leads</li>
              <li>Volume-based pricing by ZIP</li>
            </ul>
          </Card>

          <Card
            title="Custom Packages"
            price="Talk to us"
            desc="Multi-market bundles, team routing, CRM integrations."
            cta="Contact sales"
          />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Quick registration</h2>
          <div className="card shadow-soft p-6 rounded-2xl">
            <LeadForm compact />
          </div>
        </section>
      </main>
    </>
  );
}

