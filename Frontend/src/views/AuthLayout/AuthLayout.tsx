import { useLocation, useOutlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import loginImg from "../assets/login-image.svg";
import registerImg from "../assets/register-image.svg";
import styles from "./AuthLayout.module.css";

export const AuthLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const isRegister = location.pathname === "/register";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const transitionConfig = {
    exit: { duration: 0.2 },
    enter: { delay: isMobile ? 0.2 : 0.8, duration: 0.4 },
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0 overflow-hidden bg-white">
      <div className="row g-0 w-100 position-relative m-0">
        <motion.div
          className={`col-lg-6 col-12 d-flex align-items-center justify-content-center p-4 p-lg-5 bg-white min-vh-100 ${styles.formCol}`}
          animate={{ x: isMobile ? 0 : isRegister ? "100%" : "0%" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: isMobile ? 0 : 0.2,
          }}
        >
          <div className={`w-100 ${styles.contentInner}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={location.pathname}
                className={styles.stackItem}
                initial={{ opacity: 0, y: isMobile ? 10 : 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: transitionConfig.enter,
                }}
                exit={{
                  opacity: 0,
                  y: isMobile ? -10 : 0,
                  transition: transitionConfig.exit,
                }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className={`col-lg-6 d-none d-lg-block ${styles.imageCol}`}
          animate={{ x: isRegister ? "-100%" : "0%" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className={`h-100 w-100 p-5 ${styles.imageInner}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={location.pathname}
                src={isRegister ? registerImg : loginImg}
                className={`img-fluid ${styles.illustration} ${styles.stackItem}`}
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: transitionConfig.enter,
                }}
                exit={{
                  opacity: 0,
                  scale: 1,
                  transition: transitionConfig.exit,
                }}
                alt="Illustration"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
