import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const user = sessionStorage.getItem("user");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
