import React from "react";
import Header from "../components/Header.jsx";

import Boundary from "../components/Boundary";
export default function Landing(){
  return (
    <>
      <Header/>
      <section className="hero">
        <div className="container" style={{padding:"64px 0"}}>
          <div className="row" style={{gridTemplateColumns:"1.1fr .9fr",alignItems:"center"}}>
            <div>
              <h1 style={{fontSize:42,lineHeight:1.1,margin:0,color:"#0f172a",fontWeight:900}}>
                Meet more <span style={{color:"var(--cobalt)"}}>real buyers</span> in your market.
              </h1>
              <p style={{marginTop:12,color:"#334155",fontSize:18}}>
                We surface live intent from trusted communities and route it to a vetted local agent.
              </p>
              <div style={{marginTop:18,display:"flex",gap:12}}>
                <a href="#/pricing" className="btn btn-primary">Start Receiving Leads</a>
                <a href="#how" className="btn" style="border:1px solid #e2e8f0">How it works</a>
              </div>
              <div className="row" style={{gridTemplateColumns:"repeat(3,1fr)",marginTop:28}}>
                {[
                  ["1.2M+","Monthly views"],
                  ["5k+","Daily posts"],
                  ["50","Agents / state"]
                ].map(([n,l],i)=>(
                  <div className="card" key={i} style={{padding:16,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:800}}>{n}</div>
                    <div className="small" style={{marginTop:6}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src="/img/hero_photo.svg" alt="" className="shadow-soft" style={{width:"100%",borderRadius:24}}/>
            </div>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="container" style={{padding:"48px 0"}}>
          <div className="row row-2">
            {[
              ["Community-sourced demand","We watch real conversations to find genuine buyer intent.","/img/badges/reddit.svg"],
              ["Local matches","Zip-routed, vetted agents only. No spam blasts, ever.","/img/badges/craigslist.svg"],
              ["Signal over noise","We de-duplicate, score, and route only the good stuff.","/img/badges/x.svg"]
            ].map(([t,d,b],i)=>(
              <div className="card" key={i} style={{padding:18,display:"flex",gap:12}}>
                <img alt="" src={b} style={{height:24,width:24,marginTop:4}}/>
                <div>
                  <div style={{fontWeight:700}}>{t}</div>
                  <div style={{color:"#334155"}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="buyers" style={{background:"#fff"}}>
        <div className="container" style={{padding:"48px 0"}}>
          <h2 style={{textAlign:"center",fontSize:24,fontWeight:800,margin:0}}>Looking for a home? Tell us what you want.</h2>
          <div className="card" style={{padding:18,marginTop:16}}>
            <form className="row row-2">
              <input className="input" placeholder="Full name"/>
              <input className="input" placeholder="Email"/>
              <input className="input" placeholder="Phone"/>
              <input className="input" placeholder="ZIP"/>
              <textarea className="input" rows="4" placeholder="Neighborhoods, timing, must-haves"></textarea>
              <div><button type="button" className="btn btn-primary">Submit</button></div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

