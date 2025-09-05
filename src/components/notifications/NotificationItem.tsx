import { Trash2 } from "lucide-react";
import { Notification } from "@/types/notifications";
import { NotificationIcon } from "./";

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
  onDeleteNotification: (id: number) => void;
  formatTimeAgo: (dateString: string) => string;
}

export function NotificationItem({
  notification,
  onNotificationClick,
  onDeleteNotification,
  formatTimeAgo,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
      onClick={() => onNotificationClick(notification)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatTimeAgo(notification.created_at)}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          {!notification.is_read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNotification(notification.id);
            }}
            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
            title="Eliminar notificación"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
