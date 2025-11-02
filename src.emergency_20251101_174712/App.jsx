import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import LeadForm from "./components/LeadForm.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-graphite-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={
          <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Get Real Leads</h1>
            <div className="bg-graphite-900/60 rounded-2xl p-6 shadow-lg">
              <LeadForm />
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
