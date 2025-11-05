const card = (label, color="#2563eb") =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop stop-color='${color}' stop-opacity='.12' offset='0'/>
          <stop stop-color='${color}' stop-opacity='.06' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' rx='28' fill='url(#g)'/>
      <g fill='${color}'>
        <circle cx='56' cy='56' r='16'/>
        <rect x='88' y='44' width='210' height='16' rx='8'/>
        <rect x='88' y='70' width='150' height='12' rx='6' opacity='.7'/>
      </g>
      <text x='56' y='330' font-family='system-ui,Segoe UI,Roboto' font-size='22' fill='#0f172a' opacity='.8'>
        ${label}
      </text>
    </svg>
  `);

export const IMG_REDDIT     = card("Reddit lead",     "#ef4444");
export const IMG_CRAIGSLIST = card("Craigslist lead", "#8b5cf6");
export const IMG_FACEBOOK   = card("Facebook lead",   "#2563eb");
export const IMG_X          = card("X / Twitter",     "#0f172a");

export const HERO_1 = card("BuyerBoard", "#60a5fa");
export const HERO_2 = card("Real buyers", "#a78bfa");
export const HERO_3 = card("Zip + price match", "#34d399");
