import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const user = sessionStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
