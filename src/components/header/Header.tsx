// src/components/Header/index.tsx  (Server Component)
import { getCurrentUser } from "../../lib/auth";
import { HeaderClient } from "./HeaderClient";
import type { AuthUser } from "../../types/auth";

export default async function Header() {
  const initialUser: AuthUser | null = await getCurrentUser();
  return <HeaderClient initialUser={initialUser} />;
}
