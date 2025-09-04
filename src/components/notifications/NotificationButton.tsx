import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/notifications/useNotifications";

interface NotificationButtonProps {
  onClick: () => void;
}

export function NotificationButton({ onClick }: NotificationButtonProps) {
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      className="cursor-pointer relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Notificaciones"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-500 rounded-full min-w-[18px] h-[18px]">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
