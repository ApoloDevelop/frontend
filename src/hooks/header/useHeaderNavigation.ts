import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession } from "@/lib/auth";
import { AuthUser } from "@/types/auth";
import { useAuthUser } from "@/hooks/home/useAuthUser";

export function useHeaderNavigation(initialUser: AuthUser | null) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, setUser } = useAuthUser(initialUser);

  // Cerrar menús al navegar a otra ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    clearSession();
    closeAllMenus();
    router.replace("/login");
    router.refresh();
  };

  return {
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    userMenuOpen,
    setUserMenuOpen,
    isActive,
    handleLogout,
    closeAllMenus,
  };
}
