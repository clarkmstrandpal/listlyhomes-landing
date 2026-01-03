import React from "react";
export default class Boundary extends React.Component {
  constructor(p){ super(p); this.state={err:null,info:null}; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err, info){
    console.error("Boundary:", this.props.label || "(unnamed)", err, info);
    this.setState({ info });
  }
  render(){
    if(this.state.err){
      return (
        <div style={{padding:"16px",border:"1px solid #fca5a5",borderRadius:"12px",background:"#fff0f0"}}>
          <div style={{fontWeight:700,color:"#b91c1c"}}>Section crashed: {this.props.label}</div>
          <pre style={{whiteSpace:"pre-wrap",fontSize:12,marginTop:8}}>
{String(this.state.err.stack || this.state.err)}
{this.state.info?.componentStack || ""}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
