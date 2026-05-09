import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { TopBar } from "./components/layouts/TopBar/TopBar";
import { MainLayout } from "./components/layouts/MainLayout";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { AuthLayout } from "./views/AuthLayout/AuthLayout";
import { LoginPage } from "./views/LoginPage";
import { RegisterPage } from "./views/RegisterPage";
import { ForgotPasswordPage } from "./views/ForgotPasswordPage";
import { ForgotPasswordSuccessPage } from "./views/ForgotPasswordSuccessPage";
import { ResetPasswordPage } from "./views/ResetPasswordPage";
import { DiscoverPage } from "./views/DiscoverPage/DiscoverPage";
import { BookDetailsPage } from "./views/BookDetailsPage";
import { ShelvesPage } from "./views/ShelvesPage";
import { ReviewsPage } from "./views/ReviewsPage";
import { ProfilePage } from "./views/ProfilePage/ProfilePage";
import { ResetPasswordSuccessPage } from "./views/ResetPasswordSuccessPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <>
              <TopBar showNav={false} />
              <main>
                <Outlet />
              </main>
            </>
          }
        >
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

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
          <Route element={<MainLayout />}>
            <Route path="/dashboard/discover" element={<DiscoverPage />} />
            <Route path="/dashboard/shelves" element={<ShelvesPage />} />
            <Route path="/dashboard/reviews" element={<ReviewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/books/:title" element={<BookDetailsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
