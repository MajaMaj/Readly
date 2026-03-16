import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-5">
        <h1
          className="display-5 fw-bold mb-3"
          style={{ color: "var(--readly-green)" }}
        >
          Welcome back<span style={{ color: "var(--readly-gold)" }}>.</span>
        </h1>
        <p className="text-muted fs-5 lh-sm">
          Your bookshelf is waiting. Sign in to update your progress.
        </p>
      </div>

      <form>
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Username or Email"
            style={{ borderRadius: "12px" }}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Password"
            style={{ borderRadius: "12px" }}
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
          className="btn btn-lg w-100 fw-bold py-3 mb-4 text-white btn-primary shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          SIGN IN
        </button>
        <p className="text-center text-muted small mb-0">
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
    </>
  );
};
