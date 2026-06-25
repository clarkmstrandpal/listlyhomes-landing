import React from "react";
import { Link } from "react-router-dom";
import LeadForm from "../components/LeadForm.jsx";
import Timeline from "../components/Timeline.jsx";

const features = [
  { metric:"10K+", caption:"Active buyer posts tracked", title:"Verified & Local", text:"Every lead is tied to your market and checked for real intent." },
  { metric:"4K+",  caption:"Monthly agent matches",      title:"Reply-Ready",      text:"We score for 'ready to talk' and push to your CRM or inbox." },
  { metric:"30+",  caption:"Markets live today",         title:"Youre in Control",text:"Set filters, pause anytime. Only pay for leads you want." }
];

const posts = [
  { title:"Buyer: 3BR in Parkland  $800900k", subtitle:"Wants pool, newer roof",  badge:"/img/badges/reddit.svg" },
  { title:"Renter: 2/2 Deerfield Beach",        subtitle:"Budget $2,400",          badge:"/img/badges/craigslist.svg" },
  { title:"Seller: Broward condo",              subtitle:"Needs quick close",      badge:"/img/badges/forum.svg" },
  { title:"Buyer: Boca Raton townhome",         subtitle:"3/2 + garage",           badge:"/img/badges/x.svg" },
];

const testi = [
  { quote:"Two listing appointments in 48 hours.", name:"Katie C." },
  { quote:"Better ROI than my ad spend last month.", name:"Andrew R." },
  { quote:"The routing by ZIP is exactly what we needed.", name:"L. H." },
];

function Metric({ m }) {
  return (
    <div className="card shadow-soft p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-3xl font-extrabold text-slate-800">{m.metric}</div>
        <div className="text-sm text-slate-500 mt-1">{m.caption}</div>
      </div>
      <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"/>
      <div>
        <h3 className="font-semibold text-lg">{m.title}</h3>
        <p className="text-gray-600 mt-1">{m.text}</p>
      </div>
    </div>
  );
}

function Marquee({ items, render, height=120, ariaLabel }) {
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const el = ref.current;
    let px = 0;
    let raf;
    let hold=false;
    const step = () => {
      if(!hold){ px = (px + 1) % (el.scrollWidth/2); el.scrollLeft = px; }
      raf = requestAnimationFrame(step);
    };
    el.addEventListener("mouseenter", ()=>hold=true);
    el.addEventListener("mouseleave", ()=>hold=false);
    raf = requestAnimationFrame(step);
    return ()=> cancelAnimationFrame(raf);
  },[]);
  return (
    <div aria-label={ariaLabel} className="relative w-full overflow-x-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div ref={ref} className="flex overflow-x-scroll no-scrollbar" style={{height}}>
        <div className="flex shrink-0">{items.map((it, i)=> <div key={`a-${i}`} className="w-[360px] p-4">{render(it)}</div>)}</div>
        <div className="flex shrink-0">{items.map((it, i)=> <div key={`b-${i}`} className="w-[360px] p-4">{render(it)}</div>)}</div>
      </div>
    </div>
  );
}

export default function Landing(){
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-6 grid lg:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-[2.1rem] md:text-5xl font-extrabold leading-tight text-slate-900">
              Here to help you find <span className="text-accent">real buyers</span> in your market.
            </h1>
            <p className="text-gray-600 mt-4">We scan public sources for shopping intent and route by ZIP, budget and criteria.</p>
            <div className="mt-7 flex gap-3">
              <Link to="/pricing" className="btn-primary">Start Receiving Leads</Link>
              <Link to={{ pathname: "/", hash: "#how" }} className="btn-outline">How it works</Link>
            </div>
          </div>
          <div>
            <div className="h-[360px] rounded-3xl border border-slate-200 shadow-soft bg-white flex items-center justify-center">
              <img
                src="/img/hero-bg.jpg"
                alt="Listly Homes"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES (cards) */}
      <section className="bg-gradient-to-b from-white to-blue-50/40">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3">
          {features.map((m,i)=> <Metric key={i} m={m} />)}
        </div>
      </section>

      <Timeline />

      {/* TESTIMONIALS (more important than posts) */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Agents whove closed from Listly leads</h2>
        <Marquee
          items={testi}
          ariaLabel="Testimonials"
          render={(t)=>(
            <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-5 h-full">
              <div className="text-slate-800">{t.quote}</div>
              <div className="mt-3 text-blue-600 text-sm font-medium"> {t.name}</div>
            </div>
          )}
          height={140}
        />
      </section>

      {/* FORM */}
      <section id="form" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Looking for a home? Tell us what you want.</h2>
          <div className="mt-8 card shadow-soft p-6 rounded-2xl">
            <LeadForm />
          </div>
          <div className="text-center mt-6">
            <Link to="/pricing" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* REAL POSTS  REAL BUYERS (marquee) */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-gray-700">Real posts  real buyers</h3>
          <span className="text-xs text-gray-500">Auto-scroll  hover to pause</span>
        </div>
        <Marquee
          items={posts}
          ariaLabel="High-intent posts"
          render={(p)=>(
            <div className="rounded-2xl border border-gray-200 bg-white p-4 h-full">
              <div className="flex items-center gap-2">
                <img src={p.badge} alt="" className="w-5 h-5" onError={e=>e.currentTarget.style.display="none"}/>
                <div className="font-semibold">{p.title}</div>
              </div>
              <div className="text-gray-600 mt-1">{p.subtitle}</div>
            </div>
          )}
          height={140}
        />
      </section>

      {/* PRICING PREVIEW (last) */}
      <section className="bg-brand-gradient">
        <div className="mx-auto max-w-6xl px-4 py-10 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-xl font-semibold">Ready to meet real buyers?</div>
            <div className="text-white/90">Spin up filters and start matching today.</div>
          </div>
          <Link to="/pricing" className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50">
            View Packages
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 py-6">
         {new Date().getFullYear()} BuyerBoard. All rights reserved.
      </footer>
    </div>
  );
}
