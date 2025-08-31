// src/lib/auth.ts
export type SessionUser = { id: number; role_id: number; name?: string };

export async function getCurrentUser(): Promise<SessionUser | null> {
  // TODO: integra tu auth real (JWT, next-auth, etc.)
  return { id: 1, role_id: 3, name: "Writer" }; // role_id 3 => writer
}

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export function setSession(token: string, user?: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function getStoredUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
