import Link from "next/link";
import { User, ChevronDown, LogOut } from "lucide-react";
import { AuthUser } from "@/types/auth";
import { useClickOutside } from "@/hooks/header/useClickOutside";
import { useRef, useState } from "react";
import { NotificationButton } from "@/components/notifications/NotificationButton";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";

interface UserMenuProps {
  user: AuthUser;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export function UserMenu({
  user,
  isOpen,
  onToggle,
  onClose,
  onLogout,
}: UserMenuProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useClickOutside<HTMLDivElement>(isOpen, onClose, btnRef);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Botón de notificaciones */}
      <div className="relative">
        <NotificationButton
          onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
        />
        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </div>

      {/* Menú de usuario */}
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={onToggle}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition bg-black text-white hover:bg-purple-700 cursor-pointer"
        >
          <User className="h-4 w-4" />
          Mi perfil
          <ChevronDown className="h-4 w-4 opacity-80" />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
          >
            <Link
              href={`/users/${user.username}`}
              onClick={onClose}
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              <User className="h-4 w-4" />
              Mi perfil
            </Link>
            <button
              type="button"
              onClick={onLogout}
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
