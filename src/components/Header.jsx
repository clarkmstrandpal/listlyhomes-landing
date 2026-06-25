import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header(){
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function onDashboard(){
    if(token){ navigate("/dashboard"); }
    else{ navigate("/login"); }
  }

  return (
    <header className="header" style={{position:"sticky", top:0, zIndex:30, background:"#fff", borderBottom:"1px solid #eef1f4"}}>
      <div style={{maxWidth:1200, margin:"0 auto", padding:"10px 16px", display:"flex", alignItems:"center", gap:16}}>
        <Link to="/" style={{display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none"}}>
          <img src="/img/horzontal_logo.png" alt="Listly Homes" style={{height:36, width:"auto"}} />
          <span style={{fontWeight:800, fontSize:18, color:"#0D1A2B"}}>BuyerBoard</span>
        </Link>

        <nav style={{marginLeft:24, display:"flex", gap:18, alignItems:"center"}}>
          <NavLink to="/" style={({isActive})=>({color:isActive?"#0E57FF":"#2F3A44", textDecoration:"none"})}>Home</NavLink>
          <Link to={{ pathname: "/", hash: "#how" }} style={{color:"#2F3A44", textDecoration:"none"}}>
            How it works
          </Link>
          <Link to={{ pathname: "/", hash: "#form" }} style={{color:"#2F3A44", textDecoration:"none"}}>
            Buyer form
          </Link>
          <NavLink to="/pricing" style={({isActive})=>({color:isActive?"#0E57FF":"#2F3A44", textDecoration:"none"})}>Pricing</NavLink>
          <button onClick={onDashboard} style={{border:"1px solid #e5e7eb", padding:"6px 10px", borderRadius:10, background:"#fff", cursor:"pointer"}}>Dashboard</button>
        </nav>

        <div style={{marginLeft:"auto", display:"flex", alignItems:"center", gap:12}}>
          {!token ? (
            <Link to="/login" className="btn-outline" style={{textDecoration:"none"}}>Log in</Link>
          ) : (
            <>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div title={user?.email||""} style={{
                  width:30,height:30,borderRadius:"50%",background:"#0E57FF",
                  color:"#fff",display:"grid",placeItems:"center",fontWeight:700
                }}>
                  {(user?.email||"U").slice(0,1).toUpperCase()}
                </div>
                <span style={{fontSize:12, opacity:.7}}>Logged in</span>
              </div>
              <button onClick={logout} className="btn-outline">Log out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
