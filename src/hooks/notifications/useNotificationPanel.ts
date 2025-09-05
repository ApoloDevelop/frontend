import { useEffect, useRef } from "react";

interface UseNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fetchNotifications: (page: number) => Promise<void>; // Cambiar a Promise<void>
  fetchUnreadCount?: () => Promise<void>; // Cambiar a Promise<void>
}

export function useNotificationPanel({
  isOpen,
  onClose,
  fetchNotifications,
  fetchUnreadCount,
}: UseNotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notificaciones al abrir el panel
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // Handle clicks fuera del panel para cerrarlo
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  return { panelRef };
}
