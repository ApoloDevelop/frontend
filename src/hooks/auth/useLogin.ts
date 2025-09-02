import { useState } from "react";
import { LoginService } from "@/services/login.service";

interface UseLoginReturn {
  credentials: { credential: string; password: string };
  setCredentials: React.Dispatch<
    React.SetStateAction<{ credential: string; password: string }>
  >;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: (credential: string, password: string) => Promise<void>;
}

export const useLogin = (
  onSuccess: (nextUrl: string) => void
): UseLoginReturn => {
  const [credentials, setCredentials] = useState({
    credential: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (credential: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await LoginService.login(credential, password);
      onSuccess("/");
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return {
    credentials,
    setCredentials,
    error,
    setError,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
  };
};
