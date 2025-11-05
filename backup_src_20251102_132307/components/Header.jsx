import React from "react";

export default function Header(){
  return (
    <header className="header">
      <div className="container inner">
        <a href="#/" className="brand" aria-label="Listly Homes">
          <img src="/img/horzontal_logo.png" alt="Listly Homes" style={{height:56, width:"auto"}} />
        </a>
        <nav className="nav" style={{display:"flex",gap:14}}>
          <a href="#/">Home</a>
          <a href="#/pricing">Pricing</a>
          <a href="#/login">Login</a>
          <a href="#/pricing" className="btn btn-primary">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
