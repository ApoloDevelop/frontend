import Link from "next/link";
import { X, User, Power } from "lucide-react";
import { AuthUser } from "@/types/auth";
import { BrandLogo } from "./BrandLogo";
import { NavigationLinks } from "./NavigationLinks";
import { LoginButton } from "./LoginButton";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  isActive: (href: string) => boolean;
  onLogout: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  user,
  isActive,
  onLogout,
}: MobileDrawerProps) {
  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* DRAWER */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 z-[70] h-full w-80 max-w-[85vw] md:hidden
          bg-white shadow-xl transition-transform duration-300 transform-gpu
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Cabecera del drawer */}
        <div className="flex items-center justify-between px-3 py-3 border-b">
          <BrandLogo onMobileMenuClose={onClose} />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links de navegación */}
        <NavigationLinks 
          isActive={isActive}
          onItemClick={onClose}
          isMobile={true}
        />

        {/* Acciones del drawer */}
        <div className="mt-auto px-3 py-4 border-t space-y-2">
          {!user && (
            <LoginButton onMobileMenuClose={onClose} />
          )}

          {user && (
            <>
              <Link
                href={`/users/${user.username}`}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
              >
                <User className="h-4 w-4" />
                Mi perfil
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-200 text-red-700 px-3 py-2 text-sm hover:bg-red-50 transition"
              >
                <Power className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
