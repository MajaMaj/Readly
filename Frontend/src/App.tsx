import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "./components/layouts/TopBar/TopBar";
import { AuthLayout } from "./views/AuthLayout/AuthLayout";
import { RegisterPage } from "./views/RegisterPage";
import { LoginPage } from "./views/LoginPage";
import { ForgotPasswordPage } from "./views/ForgotPasswordPage";
import { ForgotPasswordSuccessPage } from "./views/ForgotPasswordSuccessPage";
import { ResetPasswordPage } from "./views/ResetPasswordPage";
import { ResetPasswordSuccessPage } from "./views/ResetPasswordSuccessPage";
import { Dashboard } from "./views/Dashboard";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { PublicRoute } from "./guards/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <main>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password-success"
              element={<ForgotPasswordSuccessPage />}
            />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/password-changed-success"
              element={<ResetPasswordSuccessPage />}
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
