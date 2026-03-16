import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, type RegisterData } from "../services/auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5">
        <h1
          className="display-5 fw-bold mb-3"
          style={{ color: "var(--readly-green)" }}
        >
          Join the club<span style={{ color: "var(--readly-gold)" }}>.</span>
        </h1>
        <p className="text-muted fs-5 lh-sm">
          Create your bookshelf and start tracking your reading journey today.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="mb-3"
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
