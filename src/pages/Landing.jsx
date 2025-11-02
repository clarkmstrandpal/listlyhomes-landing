import React from "react";
import Header from "../components/Header.jsx";

const Icons = {
  users: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  check: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  globe: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
};

function Stat({icon,num,cap,title,text}) {
  return (
    <div className="card center">
      <div className="accent" />
      {Icons[icon]}
      <div className="statnum">{num}</div>
      <div className="statcap">{cap}</div>
      <div style={{height:8}}/>
      <div style={{fontWeight:600}}>{title}</div>
      <div className="p">{text}</div>
    </div>
  );
}

export default function Landing(){
  return (
    <>
      <Header/>
      <main className="wrap hero">
        <div className="grid grid-2">
          <div>
            <h1 className="h1">
              Here to help you find <span style={{color:"#0E57FF",fontWeight:800}}>real buyers</span> in your market.
            </h1>
            <p className="p">We scan public sources for shopping intent and route by ZIP, budget and criteria.</p>
            <div style={{display:"flex",gap:12,margin:"16px 0 0"}}>
              <a className="btn btn-primary" href="#/pricing">Start Receiving Leads</a>
              <a className="btn btn-outline" href="#/#how">How it works</a>
            </div>
          </div>
          <div>
            <img src="/img/hero-main.jpg" alt="" style={{width:"100%",height:360,objectFit:"cover",borderRadius:24,border:"1px solid #e5e7eb"}} />
          </div>
        </div>

        <section id="how" style={{marginTop:32}}>
          <div className="grid grid-2" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <Stat icon="users" num="10K+" cap="Active buyer posts tracked" title="Verified & Local"
              text="Every lead is tied to your market and checked for real intent." />
            <Stat icon="check" num="4K+" cap="Monthly agent matches" title="Reply-Ready"
              text="We score for 'ready to talk' and push to your CRM or inbox." />
            <Stat icon="globe" num="30+" cap="Markets live today" title="Youre in Control"
              text="Set filters, pause anytime. Only pay for leads you want." />
          </div>
        </section>

        <section style={{marginTop:32}}>
          <div className="grid grid-2">
            <div className="card center">Two listing appointments in 48 hours. <strong>Katie C.</strong></div>
            <div className="card center">Better ROI than my ad spend last month. <strong>Andrew R.</strong></div>
          </div>
        </section>

        <section style={{marginTop:32}}>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <img src="/img/badges/reddit.svg" className="badge" alt="reddit"/>
              <strong>Real posts  real buyers</strong>
              <span style={{fontSize:12,color:"#94a3b8"}}>Auto-advance  hover to pause</span>
            </div>
            <div style={{height:180,border:"1px dashed #cbd5e1",borderRadius:12}}/>
          </div>
        </section>
      </main>

      <footer className="footer"> {new Date().getFullYear()} Listly Homes. All rights reserved.</footer>
    </>
  );
}
