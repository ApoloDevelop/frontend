// src/lib/auth.ts
export type SessionUser = { id: number; role_id: number; name?: string };

export const TOKEN_KEY = "token"; // localStorage
export const TOKEN_COOKIE = "apolo_token"; // cookie (para SSR)
export const USER_KEY = "user";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

const isServer = typeof window === "undefined";

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
export function setSession(token: string, user?: any) {
  if (isServer) return;
  localStorage.setItem(TOKEN_KEY, token);
  // 1 día (ajusta a lo que firmas en el backend)
  setCookie(TOKEN_COOKIE, token, 60 * 60 * 24);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Limpia sesión en cliente */
export function clearSession() {
  if (isServer) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_COOKIE);
}

export function getStoredUser<T = any>(): T | null {
  if (isServer) return null;
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

/** Obtiene el usuario actual llamando al backend con el token */
export async function getCurrentUser(): Promise<SessionUser | null> {
  // --- Rama SERVER: lee cookie con next/headers y llama al backend
  if (isServer) {
    // import dinámico para no romper el bundle del cliente
    const { cookies } = await import("next/headers");
    const token =
      (await cookies()).get(TOKEN_COOKIE)?.value ||
      (await cookies()).get(TOKEN_KEY)?.value;
    if (!token) return null;

    try {
      const res = await fetch(`${B}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const u = await res.json();
      return {
        id: u.id,
        role_id: u.role_id,
        name: u.fullname ?? u.username ?? undefined,
      };
    } catch {
      return null;
    }
  }

  // --- Rama CLIENTE: usa localStorage/cookie y llama al backend
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
    return {
      id: u.id,
      role_id: u.role_id,
      name: u.fullname ?? u.username ?? undefined,
    };
  } catch {
    return null;
  }
}
