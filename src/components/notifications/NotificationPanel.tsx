import { useEffect, useRef } from "react";
import {
  X,
  Trash2,
  MessageCircle,
  UserPlus,
  Heart,
  Bell,
  CheckCheck,
} from "lucide-react";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { Notification } from "@/types/notifications";
import { slugify } from "@/utils/normalization";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

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

  if (!isOpen) return null;

  // Ordenar notificaciones por fecha de creación (más reciente primero)
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment_reply":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "new_follower":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "review_upvote":
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
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
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navegación según el tipo de notificación
    switch (notification.type) {
      case "comment_reply":
        if (notification.comment?.article.id) {
          window.location.href = `/news/${notification.comment.article.id}`;
        }
        break;
      case "new_follower":
        if (notification.follower?.username) {
          window.location.href = `/users/${notification.follower.username}`;
        }
        break;
      case "review_upvote":
        if (notification.review?.item) {
          const item = notification.review.item;

          switch (item.item_type) {
            case "artist":
              if (item.artist && item.artist.length > 0) {
                const artistName = item.artist[0].name;
                window.location.href = `/artists/${slugify(artistName)}`;
              }
              break;

            case "album":
              if (item.album && item.album.length > 0) {
                const album = item.album[0];
                const albumName = album.name;
                const artistName =
                  album.album_artist.length > 0
                    ? album.album_artist[0].artist.name
                    : "";
                if (artistName && albumName) {
                  window.location.href = `/albums/${slugify(
                    artistName
                  )}/${slugify(albumName)}`;
                }
              }
              break;

            case "track":
              if (item.track && item.track.length > 0) {
                const track = item.track[0];
                const songTitle = track.title;
                const artistName =
                  track.track_artist.length > 0
                    ? track.track_artist[0].artist.name
                    : "";
                const albumName =
                  track.track_album.length > 0
                    ? track.track_album[0].album.name
                    : "";
                if (artistName && albumName && songTitle) {
                  window.location.href = `/songs/${slugify(
                    artistName
                  )}/${slugify(albumName)}/${slugify(songTitle)}`;
                }
              }
              break;
          }
        }
        break;
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed sm:absolute top-16 sm:top-full sm:mt-2 left-4 right-4 sm:left-auto sm:right-0 sm:w-80 max-h-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={markAllAsRead}
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

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tienes notificaciones
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
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
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
