import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
];

export default function Header() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [mobileOpen]);

  function handleDashboard() {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  function handleNavClick() {
    setMobileOpen(false);
  }

  const headerClasses = [
    "sticky top-0 z-40 border-b border-slate-200 transition-all",
    "backdrop-blur supports-[backdrop-filter]:bg-white/90",
    isScrolled ? "bg-white/95 shadow-lg" : "bg-white/90",
  ].join(" ");

  const activeLinkClasses =
    "text-slate-900 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#0E57FF] after:to-[#14C6F1]";

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 lg:py-0 lg:h-[84px]">
        <Link
          to="/"
          className="group flex items-center gap-3 text-slate-900 no-underline"
          onClick={handleNavClick}
        >
          <img
            src="/img/horzontal_logo.png"
            alt="Listly Homes logo"
            className="h-12 w-auto transition duration-200 group-hover:scale-[1.02] md:h-[72px]"
          />
          <div className="leading-tight">
            <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Listly Homes
            </span>
            <div className="text-xl font-extrabold text-slate-900 md:text-2xl">
              BuyerBoard
            </div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                [
                  "relative px-1 py-2 transition hover:text-[#0E57FF]",
                  isActive ? activeLinkClasses : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleDashboard}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0E57FF] hover:text-[#0E57FF]"
          >
            Dashboard
          </button>
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {!token ? (
            <Link to="/login" className="btn-outline" onClick={handleNavClick}>
              Log in
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-full bg-[#0E57FF]/10 px-3 py-1">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#0E57FF] text-sm font-bold text-white">
                  {(user?.email || "U").slice(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[#0E57FF]">Signed in</span>
              </div>
              <button type="button" onClick={logout} className="btn-outline">
                Log out
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-[#0E57FF] hover:text-[#0E57FF] lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden ${
          mobileOpen ? "grid grid-rows-[1fr]" : "grid-rows-[0fr]"
        } overflow-hidden border-t border-slate-200 transition-all duration-300`}
      >
        <div className="min-h-0 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-2 py-4 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.to + "-mobile"}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2 transition",
                    isActive
                      ? "bg-[#0E57FF]/10 text-[#0E57FF]"
                      : "hover:bg-slate-100",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                handleDashboard();
                handleNavClick();
              }}
              className="rounded-lg px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </button>
          </nav>
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
            {!token ? (
              <Link
                to="/login"
                className="btn-primary justify-center"
                onClick={handleNavClick}
              >
                Log in
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
                className="btn-outline justify-center"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
