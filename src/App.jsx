import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";

export default function App(){
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
