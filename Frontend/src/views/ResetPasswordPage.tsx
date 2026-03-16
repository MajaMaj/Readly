import { useResetPasswordPage } from "../hooks/useResetPasswordPage";

export const ResetPasswordPage = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useResetPasswordPage();

  return (
    <div
      className="container px-4"
      style={{ maxWidth: "500px", paddingTop: "20vh" }}
    >
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 text-primary">
          New password<span className="text-secondary"> .</span>
        </h1>
        <p className="text-muted fs-6 px-4">
          Please enter your new secure password below.
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
            type="password"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="New Password"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control form-control-lg bg-light border-0 py-3"
            placeholder="Confirm New Password"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-lg w-100 fw-bold py-3 mb-4 text-white btn-primary shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          UPDATE PASSWORD
        </button>
      </form>
    </div>
  );
};
