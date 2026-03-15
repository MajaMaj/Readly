import { useNavigate } from "react-router-dom";
import loginImg from "./assets/login-image.svg";

export const LoginView = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid min-vh-100 d-flex p-0 bg-white">
      <div className="row g-0 w-100">
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-5">
          <div style={{ maxWidth: "420px", width: "100%" }}>
            <div className="mb-5">
              <h1
                className="display-5 fw-bold mb-3"
                style={{ color: "var(--readly-green)" }}
              >
                Welcome back
                <span style={{ color: "var(--readly-gold)" }}>.</span>
              </h1>
              <p className="text-muted fs-5 lh-sm">
                Your bookshelf is waiting. Sign in to update your progress and
                rate your latest discoveries.
              </p>
            </div>

            <form>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0 py-3"
                  placeholder="Username or Email"
                  style={{ borderRadius: "12px", fontSize: "0.95rem" }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg bg-light border-0 py-3"
                  placeholder="Password"
                  style={{ borderRadius: "12px", fontSize: "0.95rem" }}
                />
              </div>

              <div className="mb-5 text-end">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none fw-bold"
                  style={{ color: "var(--readly-gold)", fontSize: "0.85rem" }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="button"
                className="btn btn-lg w-100 fw-bold py-3 mb-4 text-white shadow-sm"
                style={{
                  backgroundColor: "var(--readly-green)",
                  border: "none",
                  borderRadius: "12px",
                  letterSpacing: "0.5px",
                }}
              >
                SIGN IN
              </button>

              <p className="text-center text-muted small mb-0 fw-bold">
                New to the club?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 border-0 align-baseline fw-bold text-decoration-none"
                  style={{ color: "var(--readly-gold)", fontSize: "inherit" }}
                  onClick={() => navigate("/register")}
                >
                  Start your journey
                </button>
              </p>
            </form>
          </div>
        </div>

        <div
          className="col-lg-6 d-none d-lg-block position-relative"
          style={{ backgroundColor: "#FAF3E0" }}
        >
          <div className="h-100 w-100 d-flex align-items-center justify-content-center p-5">
            <img
              src={loginImg}
              alt="Reading illustration"
              className="img-fluid"
              style={{
                maxHeight: "80%",
                objectFit: "contain",
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.05))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
