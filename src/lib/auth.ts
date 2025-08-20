// src/lib/auth.ts
export type SessionUser = { id: number; role_id: number; name?: string };

export async function getCurrentUser(): Promise<SessionUser | null> {
  // TODO: integra tu auth real (JWT, next-auth, etc.)
  return { id: 1, role_id: 3, name: "Writer" }; // role_id 3 => writer
}
