import React, { useEffect, useRef, useState } from "react";
const STAR = "★";
const DEFAULTS = [
  { name: "Katie C.",  avatar: "/img/avatar-1.jpg", location: "Bentonville, AR",    rating: 5,
    quote: "Two listing appointments in 48 hours. The intent scoring is spot on." },
  { name: "Andrew R.", avatar: "/img/avatar-2.jpg", location: "Kansas City, MO",     rating: 5,
    quote: "Better ROI than my ad spend last month. Kept only the buyers I wanted." },
  { name: "Marisol P.",avatar: "/img/avatar-3.jpg", location: "Fort Lauderdale, FL", rating: 5,
    quote: "Stopped chasing junk. The filters + pausing are perfect for busy weeks." },
  { name: "Daniel T.", avatar: "/img/avatar-4.jpg", location: "Austin, TX",          rating: 4,
    quote: "Lead quality is consistently high. Closed 3 deals in the first 30 days." }
];

export default function Testimonials({ items = DEFAULTS, intervalMs = 5000 }) {
  const [i, setI] = useState(0);
  const hovered = useRef(false);
  const [step, setStep] = useState(100);
  const max = items.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width:900px)");
    const update = () => setStep(mq.matches ? 50 : 100);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const t = setInterval(() => { if (!hovered.current) setI(x => (x + 1) % max); }, intervalMs);
    return () => clearInterval(t);
  }, [max, intervalMs]);

  const go = (idx) => setI((idx + max) % max);

  return (
    <div className="testi" onMouseEnter={()=>hovered.current=true} onMouseLeave={()=>hovered.current=false}>
      <button className="arrow left" aria-label="previous" onClick={()=>go(i-1)}>‹</button>
      <button className="arrow right" aria-label="next" onClick={()=>go(i+1)}>›</button>

      <div className="testi-track" style={{ width:`${max*100}%`, transform:`translateX(-${i*step}%)` }}>
        {items.map((t, idx)=>(
          <div key={idx} className="testi-card">
            <div className="testi-head">
              <img src={t.avatar} alt={t.name} className="testi-avatar"
                   onError={e=>{e.currentTarget.src="/img/avatar-1.jpg"}} />
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-meta">{t.location}</div>
              </div>
              <div style={{marginLeft:"auto"}} className="stars">{STAR.repeat(t.rating)}</div>
            </div>
            <p className="testi-quote">“{t.quote}”</p>
          </div>
        ))}
      </div>

      <div className="testi-nav">
        {items.map((_, idx)=>(
          <div key={idx} className={`dot ${idx===i ? "active" : ""}`} onClick={()=>go(idx)} />
        ))}
      </div>
    </div>
  );
}
