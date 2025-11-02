import React from "react";
import Header from "../components/Header.jsx";
export default function Login(){
  return (
    <>
      <Header/>
      <main className="wrap" style={{padding:"32px 0"}}>
        <h1 className="h1" style={{fontSize:28}}>Agent login</h1>
        <p className="p">Use the dashboard credentials you tested earlier.</p>
      </main>
    </>
  );
}
