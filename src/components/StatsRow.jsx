import { CheckCircle2, Reply, SlidersHorizontal } from "lucide-react";

export default function StatsRow(){
  const items = [
    { metric: "10K+", icon: CheckCircle2, line: "Verified & Local",
      copy: "Every lead is tied to your market and checked for real intent." },
    { metric: "4K+", icon: Reply, line: "Reply-Ready",
      copy: "We score for 'ready to talk' and push to your CRM or inbox." },
    { metric: "30+", icon: SlidersHorizontal, line: "Youre in Control",
      copy: "Set filters, pause anytime. Only pay for leads you want." },
  ];
  return (
    <section id="features" className="py-8">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-5">
        {items.map((it,i)=>{
          const Icon = it.icon;
          return (
            <div key={i} className="card p-6 flex flex-col items-center text-center">
              <div className="text-3xl font-extrabold text-slate-900">{it.metric}</div>
              <div className="h-px w-full bg-slate-200 my-3" />
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-5 h-5 text-green-600" />
                <div className="font-semibold text-slate-900">{it.line}</div>
              </div>
              <div className="text-slate-600 text-sm mt-1">{it.copy}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
