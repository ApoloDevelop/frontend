import { useCallback } from "react";
import {
  useNotifications,
  useNotificationPanel,
  useNotificationNavigation,
  useTimeFormatter,
} from "@/hooks/notifications";
import { Notification } from "@/types/notifications";
import { NotificationPanelHeader, NotificationPanelContent } from "./";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const { panelRef } = useNotificationPanel({
    isOpen,
    onClose,
    fetchNotifications,
  });

  const { navigateToNotification } = useNotificationNavigation();
  const { formatTimeAgo } = useTimeFormatter();

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        await markAsRead(notification.id);
      }
      navigateToNotification(notification);
    },
    [markAsRead, navigateToNotification]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed sm:absolute top-16 sm:top-full sm:mt-2 left-4 right-4 sm:left-auto sm:right-0 sm:w-80 max-h-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
    >
      <NotificationPanelHeader
        notifications={notifications}
        onClose={onClose}
        onMarkAllAsRead={markAllAsRead}
      />

      <NotificationPanelContent
        notifications={notifications}
        loading={loading}
        error={error}
        onNotificationClick={handleNotificationClick}
        onDeleteNotification={deleteNotification}
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  );
}
