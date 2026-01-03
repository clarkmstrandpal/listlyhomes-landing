import { useEffect, useState } from "react";
const DATA = [
  { q:"Our office doubled buyer replies the first month.", a:" K. Martinez, Broker", img:"/img/avatar-1.jpg" },
  { q:"Clean leads, instant alerts, easy claiming.", a:" A. Chen, Team Lead", img:"/img/avatar-2.jpg" },
  { q:"Finally something agents actually use daily.", a:" D. Patel, Agent", img:"/img/avatar-1.jpg" },
];
export default function TestimonialCarousel(){
  const [i,setI] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setI(p=>(p+1)%DATA.length),4000); return ()=>clearInterval(id);},[]);
  const t = DATA[i];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="card p-8 text-center min-h-[180px] flex flex-col items-center justify-center">
          <img src={t.img} alt="" className="w-12 h-12 rounded-full object-cover mb-3" />
          <p className="text-lg text-slate-800 font-medium">{t.q}</p>
          <p className="mt-2 text-slate-500">{t.a}</p>
          <div className="mt-4 flex gap-2">
            {DATA.map((_,j)=>(<span key={j} className={`carousel-dot ${i===j?"active":""}`}></span>))}
          </div>
        </div>
      </div>
    </section>
  );
}
