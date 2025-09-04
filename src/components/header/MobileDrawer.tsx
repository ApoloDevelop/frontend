import Link from "next/link";
import { X, User, Power, Bell } from "lucide-react";
import { AuthUser } from "@/types/auth";
import { BrandLogo } from "./BrandLogo";
import { NavigationLinks } from "./NavigationLinks";
import { LoginButton } from "./LoginButton";
import { useState } from "react";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/hooks/notifications/useNotifications";

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
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();

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
          {!user && <LoginButton onMobileMenuClose={onClose} />}

          {user && (
            <>
              {/* Botón de notificaciones (móvil) */}
              <div className="relative">
                <button
                  onClick={() =>
                    setNotificationPanelOpen(!notificationPanelOpen)
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 transition relative"
                >
                  <Bell className="h-4 w-4" />
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Panel de notificaciones móvil */}
                {notificationPanelOpen && (
                  <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                      <NotificationPanel
                        isOpen={true}
                        onClose={() => setNotificationPanelOpen(false)}
                      />
                    </div>
                  </div>
                )}
              </div>

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
