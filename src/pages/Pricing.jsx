import React from "react";
import Header from "../components/Header.jsx";

export default function Pricing(){
  return (
    <>
      <Header/>
      <main className="wrap" style={{padding:"32px 0"}}>
        <h1 className="h1" style={{fontSize:32}}>Choose your plan</h1>
        <div className="grid grid-2" style={{gridTemplateColumns:"repeat(3,1fr)",marginTop:16}}>
          <div className="card">
            <h3>Per-ZIP</h3>
            <p className="p">$50 / ZIP / mo</p>
            <ul>
              <li>Shared routing in selected ZIPs</li>
              <li>Email delivery</li>
            </ul>
            <a className="btn btn-primary" href="#/signup" style={{marginTop:12}}>Continue</a>
          </div>
          <div className="card">
            <h3>Exclusive ZIP</h3>
            <p className="p">From $1,000 / mo</p>
            <ul>
              <li>Exclusive rights per ZIP</li>
              <li>Price varies by demand</li>
            </ul>
            <a className="btn" href="mailto:sales@listlyhomes.com" style={{border:"1px solid #e5e7eb"}}>Contact sales</a>
          </div>
          <div className="card">
            <h3>Custom</h3>
            <p className="p">Well tailor a package</p>
            <a className="btn" href="mailto:sales@listlyhomes.com" style={{border:"1px solid #e5e7eb"}}>Talk to us</a>
          </div>
        </div>
      </main>
    </>
  );
}
