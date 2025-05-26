import { useState } from "react";

export function usePasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return {
    showPassword,
    togglePassword: () => setShowPassword((v) => !v),
    showConfirmPassword,
    toggleConfirmPassword: () => setShowConfirmPassword((v) => !v),
  };
}
