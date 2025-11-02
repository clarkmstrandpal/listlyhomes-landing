export default function SocialFeed(){
  const posts = [
    {
      id: "r1",
      badge: "/img/badges/reddit.svg",
      title: "Looking to buy in Parkland  3/2 with a pool",
      snippet: "Budget up to $850k. Schools a must. DM if youre an agent with something coming soon.",
    },
    {
      id: "c1",
      badge: "/img/badges/craigslist.svg",
      title: "Cash buyer: Deerfield Beach condo under $400k",
      snippet: "Prefer east of US-1. 2/2 ok. Not 55+. Ready to move next 60 days.",
    },
    {
      id: "x1",
      badge: "/img/badges/x.svg",
      title: "Relocating to SoFlo  need townhouse, 2-car garage",
      snippet: "Job transfer in 45 days. Boca/Delray. Can waive minor repairs.",
    },
  ];

  return (
    <section className="py-14" aria-label="Real posts  real buyers">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold">Real posts  real buyers</h2>
        <p className="text-slate-600 mt-2">Live demand we surface for agents. These are examples of actual buyer intent.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {posts.map(p => (
            <div key={p.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={p.badge} alt="" className="w-6 h-6" />
                <h3 className="font-semibold">{p.title}</h3>
              </div>
              <p className="text-slate-700">{p.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
