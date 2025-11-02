import { useEffect, useRef, useState } from "react";

export default function Carousel({ items, interval = 4000, className = "" }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const hoverRef = useRef(false);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const goTo = (i) => setIndex(i);

  useEffect(() => {
    if (!items?.length) return;
    const tick = () => !hoverRef.current && next();
    timerRef.current = setInterval(tick, interval);
    return () => clearInterval(timerRef.current);
  }, [items, interval]);

  const onEnter = () => (hoverRef.current = true);
  const onLeave = () => (hoverRef.current = false);

  const current = items[index];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="region"
      aria-label="Lead examples"
    >
      {/* Slide */}
      <div className="card shadow-soft overflow-hidden">
        <img
          src={current.img}
          alt={current.title}
          className="w-full h-[380px] md:h-[440px] object-cover"
        />
        {/* brand badge */}
        {current.logo && (
          <img
            src={current.logo}
            alt=""
            className="absolute -right-4 -top-4 h-10 w-10 rounded-full ring-4 ring-white shadow-md"
          />
        )}
        {/* caption */}
        <div className="px-5 py-4">
          <div className="font-semibold text-gray-900 text-lg">{current.title}</div>
          <div className="text-gray-600">{current.subtitle}</div>
        </div>
      </div>

      {/* dots */}
      <div className="absolute inset-x-0 -bottom-4 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-blue-600" : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
