// src/lib/auth.ts

import { ApiUser, AuthUser, SessionUser } from "@/types/auth";

export const TOKEN_KEY = "token"; // localStorage
export const TOKEN_COOKIE = "apolo_token"; // cookie (para SSR)
export const USER_KEY = "user";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

const isServer = typeof window === "undefined";

export function normalizeUser(u: ApiUser): AuthUser {
  const id = Number(u.id);
  const role_id = Number(u.role_id ?? u.role_id ?? 0);

  const username = (u.username ?? "").toString();
  // si no viene username, intenta derivar de name (fallback seguro)
  const safeUsername =
    username || (u.fullname ?? "").toString() || `user-${id}`;

  const fullname = (u.fullname ?? null) as string | null;
  const display =
    fullname && fullname.trim().length > 0 ? fullname : safeUsername;

  return {
    id,
    role_id,
    username: safeUsername,
    fullname,
    name: display,
  };
}

/** Lee una cookie en cliente */
function getCookie(name: string): string | null {
  if (isServer) return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Escribe cookie en cliente (no HttpOnly) */
function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (isServer) return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

/** Borra cookie en cliente */
function deleteCookie(name: string) {
  if (isServer) return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Token para llamadas desde el cliente */
export function getToken(): string | null {
  if (isServer) return null;
  // 1) localStorage
  const fromLS = localStorage.getItem(TOKEN_KEY);
  if (fromLS) return fromLS;
  // 2) cookie (por si al recargar aún no está el LS)
  return getCookie(TOKEN_COOKIE);
}

/** Guarda sesión en cliente (LS + cookie para SSR) */
export function setSession(token: string, user?: AuthUser) {
  if (isServer) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Guardamos también en cookie para SSR (30 días)
  setCookie(TOKEN_COOKIE, token, 30 * 24 * 60 * 60);
}

/** Limpia sesión en cliente */
export function clearSession() {
  if (isServer) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_COOKIE); // apolo_token
  deleteCookie(TOKEN_KEY); // token (legacy)
}

export function getStoredUser<T = any>(): T | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

/** Obtiene el usuario actual llamando al backend con el token */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // --- SERVER
  if (isServer) {
    const { cookies } = await import("next/headers");
    const c = cookies();
    const token = (await c).get(TOKEN_COOKIE)?.value ?? null; // 🚫 quita el fallback a TOKEN_KEY
    if (!token) return null;
    try {
      const res = await fetch(`${B}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const u = await res.json();
      return normalizeUser(u as ApiUser);
    } catch {
      return null;
    }
  }
  // --- CLIENT
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${B}/auth/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const u = await res.json();
    const norm = normalizeUser(u as ApiUser);
    return norm;
  } catch {
    return null;
  }
}
