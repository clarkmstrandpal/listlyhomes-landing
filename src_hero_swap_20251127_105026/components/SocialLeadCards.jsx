export default function SocialLeadCards(){
  return (
    <section className="py-6">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
        <div className="card p-6 h-56">
          <div className="text-slate-500 text-sm mb-2">Real posts  real buyers</div>
          <div className="w-full h-40 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3 text-slate-500">
            <img src="/img/x.svg" alt="X" className="w-8 h-8 opacity-70"/>
            <span>X / Twitter</span>
          </div>
        </div>
        <div className="card p-6 h-56">
          <div className="text-slate-500 text-sm mb-2">Categorized lead</div>
          <div className="w-full h-40 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3 text-slate-500">
            <img src="/img/craigslist.svg" alt="Craigslist" className="w-8 h-8 opacity-70"/>
            <span>Craigslist feed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
