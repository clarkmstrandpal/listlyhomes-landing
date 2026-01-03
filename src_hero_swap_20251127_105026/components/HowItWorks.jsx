import React from "react";

function Step({n, title, text}){
  return (
    <div className="hiw-step">
      <div className="hiw-num">{n}</div>
      <div>
        <div className="hiw-title">{title}</div>
        <div className="hiw-text">{text}</div>
      </div>
    </div>
  );
}

function Example({logo="/img/badges/reddit.svg", user="u/homehunter", text="Looking for 3bd near great schools. Budget up to $450k in 72712.", ts="2h ago", tilt="left"}){
  return (
    <div className={`ex-card ${tilt==="right" ? "tilt-r" : "tilt-l"}`}>
      <div className="ex-head">
        <img src={logo} alt="src" className="badge"/>
        <div className="ex-user">{user}</div>
        <div className="ex-ts">{ts}</div>
      </div>
      <div className="ex-body">{text}</div>
    </div>
  );
}

export default function HowItWorksSection(){
  return (
    <section className="section">
      <div className="hiw">
        <div className="hiw-left">
          <h2 className="h2">How it works</h2>
          <Step n="1" title="Capture" text="We watch sources you allow—politely and ToS-safe." />
          <Step n="2" title="Score" text="Each lead is enriched, deduped, and tagged with provenance." />
          <Step n="3" title="Route" text="ZIP routing picks the right agent using your rules." />
          <Step n="4" title="Work" text="Claim, message, and track outcomes from the dashboard." />
          <div style={{marginTop:12}}>
            <a className="btn btn-outline" href="#/login">Log in</a>
          </div>
        </div>
        <div className="hiw-right">
          <Example tilt="left" user="u/relocating-dad" text="Moving to Parkland in June. 4bd, pool if possible. Budget $1.1M." ts="5h ago" />
          <Example tilt="right" user="u/renter-to-buy" text="Renting now, want to buy in 6-9 months. 2bd townhouse Deerfield Beach. $420k." ts="1d ago" />
        </div>
      </div>
    </section>
  );
}
