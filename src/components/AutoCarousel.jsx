import { useEffect, useRef } from "react";

export default function AutoCarousel({ items, speed = 36, tall = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf, x = 0;
    const step = () => {
      x -= 0.5; // base scroll
      track.style.transform = `translateX(${x}px)`;
      // loop: if leftmost card fully left, reset
      const first = track.children[0];
      if (first) {
        const rect = first.getBoundingClientRect();
        if (rect.right < 0) {
          track.appendChild(first);
          x += rect.width + 16; // gap compensation
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    track.addEventListener("mouseenter", () => cancelAnimationFrame(raf));
    track.addEventListener("mouseleave", () => (raf = requestAnimationFrame(step)));
    return () => cancelAnimationFrame(raf);
  }, [items, speed]);

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4">
        {[...items, ...items].map((it, idx) => (
          <Card key={idx} item={it} tall={tall} />
        ))}
      </div>
    </div>
  );
}

function Card({ item, tall }) {
  return (
    <div className="relative">
      {/* floating brand badge */}
      {item.logo && (
        <img
          src={item.logo}
          alt=""
          className="absolute -right-3 -top-3 h-8 w-8 rounded-full ring-4 ring-white shadow-md z-10"
        />
      )}
      <div className="card shadow-soft overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className={tall ? "w-[420px] h-[240px] object-cover" : "w-[360px] h-[200px] object-cover"}
        />
        <div className="px-4 py-3">
          <div className="font-semibold text-gray-800">{item.title}</div>
          <div className="text-sm text-gray-600 break-words">{item.subtitle}</div>
        </div>
      </div>
    </div>
  );
}

