import { useNavigate } from "react-router-dom";

export const ResetPasswordSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container px-4 text-center"
      style={{ maxWidth: "500px", paddingTop: "25vh" }}
    >
      <h1 className="fw-bold mb-3" style={{ color: "var(--readly-green)" }}>
        All set<span style={{ color: "var(--readly-gold)" }}>!</span>
      </h1>
      <p className="text-muted fs-6 mb-5 px-4">
        Your password has been successfully updated. You can now use your new
        password to sign in.
      </p>
      <button
        className="btn btn-lg w-100 fw-bold py-3 text-white btn-primary shadow-sm"
        style={{ borderRadius: "12px" }}
        onClick={() => navigate("/login")}
      >
        GO TO LOGIN
      </button>
    </div>
  );
};
