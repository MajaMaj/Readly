import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginView } from "./views/LoginView";
import { TopBar } from "./components/layouts/TopBar/TopBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="position-relative">
        <div className="position-absolute top-0 w-100" style={{ zIndex: 1000 }}>
          <TopBar />
        </div>
        <main>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<div>Register</div>} />
            <Route path="/" element={<LoginView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
