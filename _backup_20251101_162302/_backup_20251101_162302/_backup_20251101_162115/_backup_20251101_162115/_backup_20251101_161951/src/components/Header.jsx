import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../auth";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const link = "px-3 py-2 rounded hover:bg-gray-100";
  const cta  = "px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700";

  function logout() { auth.logout(); nav("/"); }

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="BuyerBoard" className="h-7 w-7"/>
          <span className="text-lg font-bold text-blue-700">BuyerBoard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <a href="/#how" className={link}>How it works</a>
          <NavLink to="/buy" className={link}>Buyer Form</NavLink>
          <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {!auth.isLoggedIn() ? (
            <>
              <NavLink to="/login" className={link}>Log in</NavLink>
              {/* Only one CTA at far right */}
              {pathname !== "/signup" && <NavLink to="/signup" className={cta}>Get Started</NavLink>}
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">Logged in</span>
              <button onClick={logout} className={link}>Log out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
