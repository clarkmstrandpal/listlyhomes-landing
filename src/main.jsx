import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

window.addEventListener("error", e => console.error("GlobalError:", e.error || e.message));
window.addEventListener("unhandledrejection", e => console.error("UnhandledRejection:", e.reason));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App/>
    </HashRouter>
  </React.StrictMode>
);


// header shadow on scroll
window.addEventListener('scroll', () => {
  const h = document.querySelector('.header');
  if (!h) return;
  if (window.scrollY > 4) h.classList.add('scrolled'); else h.classList.remove('scrolled');
});
