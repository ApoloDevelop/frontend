// src/hooks/home/useAuthUser.ts
"use client";

import { useEffect, useState } from "react";
import { getStoredUser, getToken, setSession, clearSession } from "@/lib/auth";
import { LoginRepository } from "@/repositories/login.repository";
import type { AuthUser } from "@/types/auth";

export function useAuthUser(initialUser: AuthUser | null) {
  // 👇 Primer render del cliente usa EXACTAMENTE lo que pintó el servidor
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    // Refresco tras montar (no afecta al HTML ya hidratado)
    const cached = getStoredUser() as AuthUser | null;
    if (cached) setUser(cached);

    LoginRepository.getProfile(token)
      .then((u: any) => {
        const norm: AuthUser = {
          id: Number(u.id),
          role_id: Number(u.role_id ?? u.role),
          username: String(u.username),
          fullname: u.fullname ?? null,
          name: (u.fullname ?? u.username) as string,
        };
        setUser(norm);
        setSession(token, norm);
      })
      .catch(() => {
        clearSession();
        setUser(null);
      });
  }, []);

  // Sincronía entre pestañas
  useEffect(() => {
    const onStorage = () => {
      const u = getStoredUser() as AuthUser | null;
      setUser(u);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, setUser };
}
