import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export const useForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      navigate("/reset-password-success", { state: { email } });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, error, isLoading, handleSubmit };
};
