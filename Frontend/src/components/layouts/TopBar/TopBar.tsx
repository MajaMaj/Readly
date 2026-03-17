import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./TopBar.module.css";
import logo from "/readly-logo.svg";

interface TopBarProps {
  showNav?: boolean;
}

export const TopBar = ({ showNav = false }: TopBarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Discover", path: "/dashboard/discover", icon: "bi-compass" },
    { label: "My Shelves", path: "/dashboard/shelves", icon: "bi-bookshelf" },
    {
      label: "My Reviews",
      path: "/dashboard/reviews",
      icon: "bi-chat-left-text",
    },
  ];

  return (
    <nav
      className={`navbar fixed-top py-3 ${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className="container d-flex align-items-center justify-content-between position-relative">
        <Link className="navbar-brand p-0 m-0" to="/dashboard/discover">
          <img src={logo} alt="Readly Logo" className={styles.logo} />
        </Link>

        {showNav && (
          <div
            className={`nav nav-pills p-1 rounded-pill position-absolute top-50 start-50 translate-middle ${styles.pillContainer}`}
          >
            {menuItems.map((item) => (
              <div key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 rounded-pill px-3 py-1 ${styles.navLink} ${
                    location.pathname === item.path ? styles.activeGold : ""
                  }`}
                >
                  <i
                    className={`bi ${item.icon} ${location.pathname === item.path ? "text-white" : "text-dark"}`}
                  ></i>
                  <span
                    className={
                      location.pathname === item.path
                        ? "fw-bold"
                        : "fw-semibold"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={{ width: "45px" }} className="d-none d-lg-block"></div>
      </div>
    </nav>
  );
};
