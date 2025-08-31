"use client";

import { useEffect, useState } from "react";
import { getStoredUser, getToken, setSession, clearSession } from "@/lib/auth";
import { LoginRepository } from "@/repositories/login.repository";
import { usePathname } from "next/navigation";

export function useAuthUser() {
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    // 1) usa caché
    const cached = getStoredUser();
    if (cached) setUser(cached);

    // 2) valida / refresca en segundo plano
    LoginRepository.getProfile(token)
      .then((u) => {
        setUser(u);
        setSession(token, u);
      })
      .catch(() => {
        clearSession();
        setUser(null);
      });
  }, [pathname]);

  // sincronia entre pestañas
  useEffect(() => {
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, setUser };
}
