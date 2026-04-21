import { useNavigate, useLocation } from "react-router-dom";

export const ForgotPasswordSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div
      className="container px-4 text-center"
      style={{ maxWidth: "500px", paddingTop: "25vh" }}
    >
      <h1 className="fw-bold mb-3" style={{ color: "var(--readly-primary)" }}>
        Check your inbox<span style={{ color: "var(--readly-gold)" }}>!</span>
      </h1>
      <p className="text-muted fs-6 mb-5 px-4">
        If an account with <strong>{email}</strong> exists, we've sent a
        password reset link there.
      </p>
      <button
        className="btn btn-lg w-100 fw-bold py-3 text-white btn-primary shadow-sm"
        style={{ borderRadius: "12px" }}
        onClick={() => navigate("/login")}
      >
        BACK TO LOGIN
      </button>
    </div>
  );
};
