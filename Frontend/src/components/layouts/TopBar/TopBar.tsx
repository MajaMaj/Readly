import { useState } from "react";
import { Link } from "react-router-dom";
import { useTopBar } from "../../../hooks/useTopBar";
import styles from "./TopBar.module.css";
import logo from "/readly-logo.svg";

interface TopBarProps {
  showNav?: boolean;
}

export const TopBar = ({ showNav = false }: TopBarProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    scrolled,
    showDropdown,
    dropdownRef,
    pathname,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  } = useTopBar();

  const handleSearchBlur = () => {
    if (searchQuery.trim() === "") {
      setShowSearch(false);
    }
  };

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
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} navbar fixed-top py-3`}
    >
      <div className="container d-flex align-items-center justify-content-between position-relative">
        <Link className="navbar-brand p-0 m-0" to="/dashboard/discover">
          <img src={logo} alt="Readly Logo" className={styles.logo} />
        </Link>

        {showNav && (
          <>
            <div className="nav nav-pills p-1 rounded-pill position-absolute top-50 start-50 translate-middle d-none d-md-flex">
              {menuItems.map((item) => (
                <div key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center gap-2 rounded-pill px-3 py-1 ${styles.navLink} ${
                      pathname === item.path ? styles.activeGold : ""
                    }`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span
                      className={
                        pathname === item.path ? "fw-bold" : "fw-semibold"
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center">
                {showSearch && (
                  <input
                    type="text"
                    className={`form-control border-0 shadow-none rounded-pill ${styles.searchInput}`}
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleSearchBlur}
                    autoFocus
                  />
                )}
                <button
                  className={`btn p-0 border-0 shadow-none me-2 d-flex align-items-center justify-content-center ${styles.searchBtn}`}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <i className="bi bi-search fs-5"></i>
                </button>
              </div>

              <div className="dropdown" ref={dropdownRef}>
                <div
                  className={`${styles.userAvatar} dropdown-toggle border-0 d-flex align-items-center justify-content-center`}
                  onClick={toggleDropdown}
                  role="button"
                >
                  <i className="bi bi-person-fill"></i>
                </div>

                <ul
                  className={`dropdown-menu dropdown-menu-end shadow border-0 p-2 ${showDropdown ? "show" : ""} ${styles.customDropdown}`}
                >
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item py-2 d-flex align-items-center"
                      onClick={closeDropdown}
                    >
                      <i className="bi bi-person me-2 fs-5"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider opacity-50" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger d-flex align-items-center"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
