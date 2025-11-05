import React from "react";

export default function BrandHeader() {
  return (
    <section id="home" className="bg-white text-slate-900 pt-10 pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Headline */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Here to help you find
              <br />
              <span className="text-[#0E57FF]">real buyers</span> in your
              <br /> market.
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              We scan Reddit, Craigslist, and social posts for home-shopping intentthen
              route each buyer to the right agent by ZIP, budget and criteria.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#get-started"
                className="rounded-full px-5 py-2.5 text-slate-900 bg-gradient-to-r from-[#0E57FF] to-[#14C6F1] shadow-sm"
              >
                Start Receiving Leads
              </a>
              <a
                href="#how"
                className="rounded-full px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right image placeholder (kept as-is; replace src to match your asset) */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/img/logo-horizontal.png"
              alt="Buyer handing keys"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}



