"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { NotificationService } from "@/services/notification.service";
import { Notification } from "@/types/notifications";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchNotifications = useCallback(async (page: number = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await NotificationService.getNotifications(page);
      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }
    } catch (err: any) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error("Error al obtener contador:", err);
      setUnreadCount(0);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        await NotificationService.deleteNotification(notificationId);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        // Actualizar contador si era no leída
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err: any) {
        setError(err.message);
      }
    },
    [notifications]
  );

  const deleteAllNotifications = useCallback(async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      await NotificationService.deleteAllNotifications();
    } catch (err: any) {
      setError(err.message);
      // En caso de error, refrescar desde el servidor
      fetchNotifications(1);
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  // Polling único para toda la aplicación
  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUnreadCount();
        // Polling cada 30 segundos
        const interval = setInterval(() => {
          const currentToken = localStorage.getItem("token");
          if (currentToken) {
            fetchUnreadCount();
          }
        }, 30000);
        return () => clearInterval(interval);
      } else {
        setUnreadCount(0);
        setNotifications([]);
      }
    }
  }, [fetchUnreadCount, isMounted]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: isMounted ? unreadCount : 0,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext debe usarse dentro de NotificationProvider"
    );
  }
  return context;
}
