import React from "react";

export default function Header(){
  return (
    <header className="header">
      <div className="wrap">
        <div className="row">
          <a href="#/">
            <img src="/img/horzontal_logo.png" alt="Listly Homes" className="logo" />
          </a>
          <nav className="nav">
            <a href="#/#how">How it works</a>
            <a href="#/buyers">Buyer Form</a>
            <a href="#/login">Dashboard</a>
          </nav>
          <div>
            <a href="#/login" style={{marginRight:12}}>Log in</a>
            <a className="btn btn-primary" href="#/pricing">Get Started</a>
          </div>
        </div>
      </div>
    </header>
  );
}
