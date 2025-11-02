import React, { createContext, useContext } from "react";

const Ctx = createContext(null);

export function BrandProvider({ children }) {
  const brand = {
    key: "agent",
    productName: "Listly Homes",
    shortTagline:
      "We scan public sources for shopping intent and route by ZIP, budget and criteria.",
    audienceCTA: "Start Receiving Leads",
    buyerCTA: "Looking for a home? Tell us what you want.",
    // Use an existing image in /public/img; change if yours is different
    heroImg: "/img/logo-horizontal.png",

    features: [
      { metric: "10K+", caption: "Active buyer posts tracked", title: "Verified & Local", text: "Every lead is tied to your market and checked for real intent." },
      { metric: "4K+", caption: "Monthly agent matches",      title: "Reply-Ready",       text: "We score for 'ready to talk' and push to your CRM or inbox." },
      { metric: "30+",  caption: "Markets live today",        title: "Youre in Control", text: "Set filters, pause anytime. Only pay for leads you want." }
    ],

    testimonials: [
      { quote: "Two listing appointments in 48 hours.", name: "Katie C." },
      { quote: "Better ROI than my ad spend last month.", name: "Andrew R." }
    ],

    slides: [
      { title: "Buyer: 3BR in Parkland  $800900k", subtitle: "Wants pool, newer roof",  badge: "/img/badges/reddit.svg" },
      { title: "Renter: 2/2 Deerfield Beach",        subtitle: "Budget $2,400",          badge: "/img/badges/craigslist.svg" },
      { title: "Seller: Broward condo",              subtitle: "Needs quick close",      badge: "/img/badges/forum.svg" }
    ],
  };

  return <Ctx.Provider value={brand}>{children}</Ctx.Provider>;
}

export const useBrand = () => useContext(Ctx);




