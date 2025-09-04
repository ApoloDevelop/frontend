"use client";

import { useState } from "react";
import { UserRepository } from "@/repositories/user.repository";

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (userId: number) => {
    setIsDeleting(true);
    setError(null);

    try {
      await UserRepository.deleteUser(userId);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar la cuenta";
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
    error,
  };
}
