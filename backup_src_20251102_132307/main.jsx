import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";

window.addEventListener("error", e => console.error("GlobalError:", e.error || e.message));
window.addEventListener("unhandledrejection", e => console.error("UnhandledRejection:", e.reason));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<App/>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
