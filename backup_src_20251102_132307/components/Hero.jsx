export default function Hero(){
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Here to help you find <span className="text-gradient-wordmark">real buyers</span> in your market.
          </h1>
          <p className="mt-3 text-lg text-slate-700">
            We scan leads, clean, and route to agents in seconds then track replies and ROI by budget and criteria.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#form" className="px-5 py-3 rounded-xl bg-gradient-core text-white font-semibold shadow-lg">Start Receiving Leads</a>
            <a href="#how" className="px-5 py-3 rounded-xl border border-slate-300 bg-white font-semibold">How it works</a>
          </div>
        </div>
        <div className="justify-self-center">
          <img src="/img/hero-bg.jpg" alt="" className="w-full max-w-md rounded-2xl shadow-xl object-cover" />
        </div>
      </div>
    </section>
  );
}
