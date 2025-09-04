import { useEffect, useRef } from "react";

interface UseNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fetchNotifications: (page: number) => void;
}

export function useNotificationPanel({
  isOpen,
  onClose,
  fetchNotifications,
}: UseNotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // Handle clicks outside panel
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
