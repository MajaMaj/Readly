import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "./components/layouts/TopBar/TopBar";
import { AuthLayout } from "./views/AuthLayout/AuthLayout";
import { RegisterPage } from "./views/RegisterPage";
import { LoginPage } from "./views/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="position-relative">
        <div className="position-absolute top-0 w-100" style={{ zIndex: 1000 }}>
          <TopBar />
        </div>
        <main>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
