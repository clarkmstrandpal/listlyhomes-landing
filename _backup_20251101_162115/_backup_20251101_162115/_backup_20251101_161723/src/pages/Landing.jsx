import { CheckCircle, MessageCircle, Sliders } from "lucide-react";
import LeadForm from "../components/LeadForm";
import FeatureCard from "../components/FeatureCard";
import AutoCarousel from "../components/AutoCarousel";

const carouselItems = [
  {
    img: "/img/reddit-card.svg",
    logo: "/img/brands/reddit.svg",
    title: "Reddit lead",
    subtitle: "3bd in 78704, $750k",
  },
  {
    img: "/img/facebook-card.svg",
    logo: "/img/brands/facebook.svg",
    title: "Facebook lead",
    subtitle: "FHA, 2–3 months out",
  },
  {
    img: "/img/x-card.svg",
    logo: "/img/brands/x.svg",
    title: "X / Twitter",
    subtitle: "Investor duplex",
  },
  {
    img: "/img/craigslist-card.svg",
    logo: "/img/brands/craigslist.svg",
    title: "Craigslist lead",
    subtitle: "Relocating, tour Fri",
  },
];

export default function Landing() {
  return (
    <>
      {/* HERO — full color image on right */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-6 grid lg:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-[2.2rem] md:text-5xl font-extrabold leading-tight text-slate-900">
              Here to help you find <span className="text-blue-600">real buyers</span> in your
              market.
            </h1>
            <p className="text-slate-700 mt-4 max-w-xl">
              We scan Reddit, Craigslist, and social posts for home-shopping intent—then route
              each buyer to the right agent by ZIP, budget and criteria.
            </p>

            <div className="mt-7 flex gap-3">
              <a href="/signup" className="btn-primary">Start Receiving Leads</a>
              <a href="#how" className="btn-ghost">How it works</a>
            </div>
          </div>

          {/* full-color hero image */}
          <div className="relative">
            <img
              src="/img/hero-bg.jpg"
              alt="BuyerBoard"
              className="w-full h-[380px] object-cover rounded-3xl shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* METRICS + FEATURES (merged into 3 big cards) */}
      <section id="how" className="bg-gradient-to-b from-white to-blue-50/40">
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-6 md:grid-cols-3">
          <MetricFeature
            metric="10K+"
            caption="Active buyer posts tracked"
            icon={<CheckCircle className="text-green-600 w-6 h-6" />}
            title="Verified & Local"
            text="Every lead is tied to your market and checked for real intent."
          />
          <MetricFeature
            metric="4K+"
            caption="Monthly agent matches"
            icon={<MessageCircle className="text-blue-600 w-6 h-6" />}
            title="Reply-Ready"
            text="We score for ‘ready to talk’ and push to your CRM or inbox."
          />
          <MetricFeature
            metric="30+"
            caption="Markets live today"
            icon={<Sliders className="text-purple-600 w-6 h-6" />}
            title="You’re in Control"
            text="Set filters, pause anytime. Only pay for leads you want."
          />
        </div>
      </section>

      {/* CAROUSEL moved into landing body; larger; logos pop outside corner */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card shadow-soft p-4">
          <div className="flex items-center justify-between px-1 pb-3">
            <h3 className="text-sm font-semibold text-gray-700">Real posts → real buyers</h3>
            <span className="text-xs text-gray-500">Auto-scroll • hover to pause</span>
          </div>
          <AutoCarousel items={carouselItems} speed={28} tall />
        </div>
      </section>

      {/* BUYER FORM (lead seeding) */}
      <section id="buyers" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Looking for a Home? We can help!
          </h2>
          {/* (sentence removed per request) */}
          <div className="mt-8"><LeadForm /></div>
          <div className="text-center mt-6">
            <a href="/signup" className="btn-primary">Start Receiving Leads</a>
          </div>
        </div>
      </section>

      {/* blue wave accent */}
      <section aria-hidden="true" className="mt-10">
        <svg viewBox="0 0 1440 180" className="w-full block">
          <path d="M0,96 C240,160 480,0 720,64 C960,128 1200,112 1440,48 L1440,180 L0,180 Z" fill="#eaf0ff"/>
        </svg>
      </section>
    </>
  );
}

function MetricFeature({ metric, caption, icon, title, text }) {
  return (
    <div className="card shadow-soft p-6">
      {/* metric area */}
      <div className="text-center">
        <div className="text-3xl font-extrabold text-slate-800">{metric}</div>
        <div className="text-sm text-slate-500 mt-1">{caption}</div>
      </div>

      <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* feature area */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}
