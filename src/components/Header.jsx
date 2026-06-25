import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import "./Header.css";

export default function Header() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `app-header__nav-link${isActive ? " is-active" : ""}`;

  const logoSrc = "/img/horzontal_logo.png";

  function onDashboard() {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          <img src={logoSrc} alt="Listly Homes" className="app-header__logo" />
          <span className="app-header__title">BuyerBoard</span>
        </Link>

        <nav className="app-header__nav">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/pricing" className={navLinkClass}>
            Pricing
          </NavLink>
          <button onClick={onDashboard} className="app-header__dashboard">
            Dashboard
          </button>
        </nav>

        <div className="app-header__cta">
          {!token ? (
            <Link to="/login" className="btn-outline app-header__login">
              Log in
            </Link>
          ) : (
            <>
              <div className="app-header__user">
                <div title={user?.email || ""} className="app-header__avatar">
                  {(user?.email || "U").slice(0, 1).toUpperCase()}
                </div>
                <span className="app-header__status">Logged in</span>
              </div>
              <button onClick={logout} className="btn-outline">
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
