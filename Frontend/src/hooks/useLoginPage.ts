import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import type { LoginData } from "../types";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("user");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      setError("Please enter both identifier and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      sessionStorage.setItem("user", JSON.stringify(response));
      navigate("/dashboard/discover");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, error, isLoading, handleChange, handleSubmit };
};
