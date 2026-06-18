import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTopBar } from "../../../hooks/useTopBar";
import { bookService } from "../../../services/books";
import { userService } from "../../../services/userService";
import type { Book } from "../../../types";
import styles from "./TopBar.module.css";
import logo from "/readly-logo.svg";

interface TopBarProps {
  showNav?: boolean;
}

export const TopBar = ({ showNav = false }: TopBarProps) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const {
    scrolled,
    showDropdown,
    dropdownRef,
    pathname,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  } = useTopBar();

  const loadAvatar = async () => {
    try {
      const user = await userService.getMe();
      setAvatarUrl(user.profile_image || null);
    } catch {
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    loadAvatar();

    const handleAvatarUpdate = () => {
      loadAvatar();
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);

        try {
          const results = await bookService.searchBooks(searchQuery);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectBook = (book: Book) => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSearch(false);

    navigate(`/books/${encodeURIComponent(book.title)}`, {
      state: { bookId: book.id },
    });
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
      className={`${styles.navbar} ${
        scrolled ? styles.scrolled : ""
      } navbar fixed-top py-3`}
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
              <div className="position-relative" ref={searchContainerRef}>
                <div className="d-flex align-items-center">
                  {showSearch && (
                    <input
                      type="text"
                      className={`form-control border-0 shadow-none rounded-pill ${styles.searchInput}`}
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  )}

                  <button
                    className={`btn p-0 border-0 shadow-none me-2 d-flex align-items-center justify-content-center ${styles.searchBtn}`}
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <i
                      className={`bi ${
                        isSearching ? "bi-hourglass-split" : "bi-search"
                      } fs-5`}
                    ></i>
                  </button>
                </div>

                {suggestions.length > 0 && (
                  <ul
                    className={`dropdown-menu show shadow-lg border-0 p-2 mt-2 ${styles.searchSuggestions}`}
                  >
                    {suggestions.map((book) => (
                      <li key={book.id}>
                        <button
                          className="dropdown-item rounded-3 d-flex align-items-center gap-3 py-2"
                          onClick={() => handleSelectBook(book)}
                        >
                          <img
                            src={
                              book.image_url?.replace("http://", "https://") ||
                              ""
                            }
                            alt=""
                            style={{
                              width: "35px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="text-truncate">
                            <div
                              className="fw-bold text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {book.title}
                            </div>
                            <small className="text-muted">{book.author}</small>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="dropdown" ref={dropdownRef}>
                <div
                  className={`${styles.userAvatar} dropdown-toggle border-0 d-flex align-items-center justify-content-center p-0 overflow-hidden`}
                  onClick={toggleDropdown}
                  role="button"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <i className="bi bi-person-fill"></i>
                  )}
                </div>

                <ul
                  className={`dropdown-menu dropdown-menu-end shadow border-0 p-2 ${
                    showDropdown ? "show" : ""
                  } ${styles.customDropdown}`}
                >
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item py-2 d-flex align-items-center"
                      onClick={closeDropdown}
                    >
                      <i className="bi bi-person me-2 fs-5"></i>
                      Profile
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
                      <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                      Logout
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
