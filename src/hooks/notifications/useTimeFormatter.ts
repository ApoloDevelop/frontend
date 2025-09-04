import { useCallback } from "react";

export function useTimeFormatter() {
  const formatTimeAgo = useCallback((dateString: string) => {
    try {
      const now = new Date();
      const notificationDate = new Date(dateString);
      const diffInMinutes = Math.floor(
        (now.getTime() - notificationDate.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "ahora mismo";
      if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
      if (diffInMinutes < 1440)
        return `hace ${Math.floor(diffInMinutes / 60)}h`;
      return `hace ${Math.floor(diffInMinutes / 1440)}d`;
    } catch {
      return "hace un momento";
    }
  }, []);

  return { formatTimeAgo };
}
