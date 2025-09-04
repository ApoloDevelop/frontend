import { X, CheckCheck } from "lucide-react";
import { Notification } from "@/types/notifications";

interface NotificationPanelHeaderProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanelHeader({
  notifications,
  onClose,
  onMarkAllAsRead,
}: NotificationPanelHeaderProps) {
  const hasUnreadNotifications = notifications.some((n) => !n.is_read);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
      <div className="flex items-center gap-2">
        {hasUnreadNotifications && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-purple-600 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            title="Marcar todas como leídas"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
