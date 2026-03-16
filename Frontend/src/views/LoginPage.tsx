import { useNavigate } from "react-router-dom";
import { useLoginPage } from "../hooks/useLoginPage";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useLoginPage();

  return (
    <>
      <div className="mb-5">
        <h1 className="display-5 fw-bold mb-3 text-primary">
          Welcome back<span style={{ color: "var(--readly-gold)" }}>.</span>
        </h1>
        <p className="text-muted fs-5 lh-sm">
          Your bookshelf is waiting. Sign in to update your progress.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="mb-2"
          style={{ minHeight: "37px", marginTop: "-2.5rem" }}
        >
          {error && (
            <div
              className="alert alert-danger py-2 small border-0 m-0"
              style={{ borderRadius: "12px" }}
            >
              {error}
            </div>
          )}
        </div>

        <div className="mb-4">
          <input
            name="identifier"
            type="text"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Username or Email"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={formData.identifier}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Password"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5 text-end">
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none fw-bold"
            style={{ color: "var(--readly-gold)", fontSize: "0.85rem" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
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
