import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import styles from "./Header.module.css";

export default function Header(){
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function onDashboard(){
    if(token){ navigate("/dashboard"); }
    else{ navigate("/login"); }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src="/img/horzontal_logo.png" alt="Listly Homes" className={styles.logoImg} />
          <span className={styles.brandText}>BuyerBoard</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()
            }
          >
            Pricing
          </NavLink>
          <button onClick={onDashboard} className={styles.dashboardButton}>Dashboard</button>
        </nav>

        <div className={styles.authGroup}>
          {!token ? (
            <Link to="/login" className={`${styles.loginLink} btn-outline`}>Log in</Link>
          ) : (
            <>
              <div className={styles.userInfo}>
                <div
                  title={user?.email || ""}
                  className={styles.avatar}
                >
                  {(user?.email||"U").slice(0,1).toUpperCase()}
                </div>
                <span className={styles.loggedInText}>Logged in</span>
              </div>
              <button onClick={logout} className="btn-outline">Log out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
