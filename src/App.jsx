import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadDetail from "./pages/LeadDetail";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider, RequireAuth } from "./lib/auth";

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          {/* NEW: Lead details page */}
          <Route
            path="/lead/:id"
            element={
              <RequireAuth>
                <LeadDetail />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}
