import React from "react";
import Header from "../components/Header.jsx";

export default function Login(){
  return (
    <>
      <Header/>
      <section className="container" style={{padding:"48px 0"}}>
        <h1 style={{fontSize:30,fontWeight:900,margin:0}}>Agent Login</h1>
        <div className="card" style={{padding:18,marginTop:16,maxWidth:460}}>
          <form className="row">
            <input className="input" placeholder="Email"/>
            <input className="input" placeholder="Password" type="password"/>
            <button type="button" className="btn btn-primary">Log in</button>
          </form>
        </div>
      </section>
    </>
  );
}
