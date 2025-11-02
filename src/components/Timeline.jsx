export default function Timeline() {
  const steps = [
    { k: 1, t: "Submit a Buyer", d: "Paste a lead or import from your sources. We auto-clean, de-dup, and score it." },
    { k: 2, t: "Smart Routing", d: "We match by ZIP and agent rules (caps, pause, SLA), then notify instantly." },
    { k: 3, t: "Follow-up & Track", d: "Use your CRM or ours; we keep an audit trail and show near-real-time metrics." },
    { k: 4, t: "Claim & Close", d: "One click to claim, then monitor conversion and ROI across campaigns." },
  ];
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
          How Listly Homes Works
        </h2>
        <ol className="relative border-l border-slate-200 pl-6 space-y-8">
          {steps.map(s => (
            <li key={s.k} className="ml-2">
              <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-gradient-face"></div>
              <h3 className="font-semibold text-slate-900">{s.t}</h3>
              <p className="text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

