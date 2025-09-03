"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    loading,
    isAdmin: currentUser?.role_id === 1,
  };
}
