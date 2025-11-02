import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sliders, MessageCircle } from "lucide-react";
import LeadForm from "./components/LeadForm";

const panels = [
  {
    title: "Verified & Local",
    text: "Every lead is tied to your market and checked for real intent.",
    icon: <CheckCircle className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Reply-Ready",
    text: "We score for 'ready to talk' and push to your CRM or inbox.",
    icon: <MessageCircle className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "You're in Control",
    text: "Set filters, pause anytime. Only pay for leads you want.",
    icon: <Sliders className="text-purple-500 w-6 h-6" />,
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("buyerboardVisited");
    if (!hasVisited) {
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("buyerboardVisited", "true");
      }, 2000);
    }
  }, []);

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900">
      {showSplash ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-blue-600"
          >
            Buyerboard
          </motion.div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="p-6 flex justify-between items-center shadow-sm bg-white">
            <div className="text-xl font-bold text-blue-600">Buyerboard</div>
            <div className="space-x-4">
              <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
                How it works
              </button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <main className="text-center py-16 px-4">
            <h1 className="text-4xl font-bold mb-4">Leads that actually reply.</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              We find real buyers online and route them to your inbox—scored for intent and matched to your market.
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                Start Receiving Leads
              </button>
              <button className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-100">
                Watch 45-sec demo
              </button>
            </div>
{/* Lead form goes here */}
<div className="mb-16">
  <LeadForm />
</div>

            {/* Panels */}
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
              {panels.map((panel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-md flex-1 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {panel.icon}
                    <h3 className="text-lg font-semibold">{panel.title}</h3>
                  </div>
                  <p className="text-gray-600">{panel.text}</p>
                </motion.div>
              ))}
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center py-6 text-sm text-gray-400">
            © {new Date().getFullYear()} Buyerboard. All rights reserved.
          </footer>
        </>
      )}
    </div>
  );
}
