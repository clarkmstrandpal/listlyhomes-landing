import React from "react";
import Header from "../components/Header.jsx";

export default function Pricing(){
  return (
    <>
      <Header/>
      <section className="container" style={{padding:"48px 0"}}>
        <h1 style={{fontSize:36,fontWeight:900,margin:0}}>Pricing</h1>
        <p className="small" style={{marginTop:6}}>Choose a plan that fits your market.</p>

        <div className="row" style={{gridTemplateColumns:"repeat(3,1fr)",marginTop:18}}>
          <div className="card" style={{padding:18}}>
            <div style={{fontWeight:800}}>ZIP Access</div>
            <div className="small" style={{marginTop:6}}>$50 / ZIP / mo</div>
            <p style={{color:"#334155"}}>Get matched with live buyer intent by ZIP.</p>
            <a href="#/login" className="btn btn-primary">Get Started</a>
          </div>

          <div className="card" style={{padding:18,borderColor:"#0E57FF"}}>
            <div style={{fontWeight:800}}>Exclusive Rights</div>
            <div className="small" style={{marginTop:6}}>From $1,000+ / ZIP / mo</div>
            <p style={{color:"#334155"}}>Reserve a ZIP exclusively. Price varies by demand.</p>
            <a href="#/login" className="btn btn-primary">Contact Sales</a>
          </div>

          <div className="card" style={{padding:18}}>
            <div style={{fontWeight:800}}>Custom Packages</div>
            <div className="small" style={{marginTop:6}}>Lets tailor it</div>
            <p style={{color:"#334155"}}>Well design a plan for your brokerage or team.</p>
            <a href="#/login" className="btn btn-primary">Talk to us</a>
          </div>
        </div>
      </section>
    </>
  );
}
