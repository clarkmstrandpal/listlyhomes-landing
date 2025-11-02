import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Header from "./components/Header";
import Landing from "./pages/Landing";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { auth } from "./auth";

function RequireAuth({ children }) {
  if (!auth.isLoggedIn()) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

function AppShell() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
        <footer className="text-center py-6 text-sm text-gray-400">
          © {new Date().getFullYear()} BuyerBoard. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
