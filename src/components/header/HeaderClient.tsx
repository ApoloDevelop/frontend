"use client";

import { AuthUser } from "@/types/auth";
import { BrandLogo } from "./BrandLogo";
import { NavigationLinks } from "./NavigationLinks";
import { DesktopActions } from "./DesktopActions";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileDrawer } from "./MobileDrawer";
import { useHeaderNavigation } from "@/hooks/header/useHeaderNavigation";
import { useKeyboardNavigation } from "@/hooks/header/useKeyboardNavigation";
import { useBodyScrollLock } from "@/hooks/header/useBodyScrollLock";

export function HeaderClient({
  initialUser,
}: {
  initialUser: AuthUser | null;
}) {
  const {
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    userMenuOpen,
    setUserMenuOpen,
    isActive,
    handleLogout,
    closeAllMenus,
  } = useHeaderNavigation(initialUser);

  useKeyboardNavigation(closeAllMenus);
  useBodyScrollLock(mobileMenuOpen);

  return (
    <>
      {/* HEADER full-bleed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
        <div className="w-full">
          <div className="h-14 sm:h-16 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center">
            {/* Brand IZQUIERDA */}
            <div className="pl-3 sm:pl-4 justify-self-start">
              <BrandLogo />
            </div>

            {/* Nav centrado (desktop) */}
            <NavigationLinks isActive={isActive} />

            {/* Acciones DERECHA */}
            <div className="pr-3 sm:pr-4 flex items-center justify-self-end">
              {/* Desktop actions */}
              <DesktopActions
                user={user}
                userMenuOpen={userMenuOpen}
                onUserMenuToggle={() => setUserMenuOpen(!userMenuOpen)}
                onUserMenuClose={() => setUserMenuOpen(false)}
                onLogout={handleLogout}
              />

              {/* Botón hamburguesa (mobile) */}
              <MobileMenuButton
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isActive={isActive}
        onLogout={handleLogout}
      />
    </>
  );
}
