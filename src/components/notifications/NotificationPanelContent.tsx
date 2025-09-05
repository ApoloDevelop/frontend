import { Notification } from "@/types/notifications";
import { NotificationItem } from "./";

interface NotificationPanelContentProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onNotificationClick: (notification: Notification) => void;
  onDeleteNotification: (id: number) => void;
  formatTimeAgo: (dateString: string) => string;
}

export function NotificationPanelContent({
  notifications,
  loading,
  error,
  onNotificationClick,
  onDeleteNotification,
  formatTimeAgo,
}: NotificationPanelContentProps) {
  // Ordenar notificaciones por fecha de creación (más reciente primero)
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading && notifications.length === 0) {
    return (
      <div className="max-h-80 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-80 overflow-y-auto">
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="max-h-80 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">
          No tienes notificaciones
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {sortedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onNotificationClick={onNotificationClick}
            onDeleteNotification={onDeleteNotification}
            formatTimeAgo={formatTimeAgo}
          />
        ))}
      </div>
    </div>
  );
}
