import { useState, useEffect } from "react";
import styles from "./TopBar.module.css";
import logo from "/readly-logo.svg";

export const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        ${styles.navbar} 
        ${scrolled ? styles.scrolled : ""} 
        navbar fixed-top
      `}
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Readly Logo" className={styles.logo} />
        </a>
      </div>
    </nav>
  );
};
