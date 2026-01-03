import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, err:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, err }; }
  componentDidCatch(err, info){ console.error("ErrorBoundary:", err, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div className="card shadow-soft p-6 my-6">
          <div className="font-semibold text-red-600">Section failed to load.</div>
          <div className="text-sm text-slate-500">See browser console for details.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

