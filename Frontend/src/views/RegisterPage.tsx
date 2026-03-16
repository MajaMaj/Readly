import { useNavigate } from "react-router-dom";
import { useRegisterPage } from "../hooks/useRegisterPage";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useRegisterPage();

  return (
    <>
      <div className="mb-5">
        <h1 className="display-5 fw-bold mb-3 text-primary">
          Join the club<span className="text-secondary">.</span>
        </h1>
        <p className="text-muted fs-5 lh-sm">
          Create your bookshelf and start tracking your reading journey today.
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

        <div className="mb-3">
          <input
            name="username"
            type="text"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Username"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Email Address"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={formData.email}
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
        <div className="mb-4">
          <input
            name="confirmPassword"
            type="password"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Confirm Password"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-lg w-100 fw-bold py-3 mb-4 text-white btn-primary shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          CREATE ACCOUNT
        </button>

        <p className="text-center text-muted small mb-0">
          Already a reader?{" "}
          <button
            type="button"
            className="btn btn-link p-0 border-0 align-baseline fw-bold text-decoration-none"
            style={{ color: "var(--readly-gold)", fontSize: "inherit" }}
            onClick={() => navigate("/login")}
          >
            Sign in here
          </button>
        </p>
      </form>
    </>
  );
};
