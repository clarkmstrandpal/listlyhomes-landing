export default function BadgesRow(){
  const items = [
    {src:"/img/badges/x.svg",          label:"X / Twitter"},
    {src:"/img/badges/reddit.svg",     label:"Reddit"},
    {src:"/img/badges/craigslist.svg", label:"Craigslist"},
  ];
  return (
    <section className="py-6" id="badges">
      <div className="mx-auto max-w-6xl px-4 grid sm:grid-cols-3 gap-4">
        {items.map((b,i)=>(
          <div key={i} className="card card-hover p-4 flex items-center gap-3">
            <img src={b.src} alt="" className="w-8 h-8 object-contain opacity-80" onError={(e)=>e.currentTarget.style.display='none'} />
            <span className="text-slate-700">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
