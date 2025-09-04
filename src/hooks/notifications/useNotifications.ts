"use client";

import { useState, useEffect, useCallback } from "react";
import { NotificationService } from "@/services/notification.service";
import { Notification } from "@/types/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [lastActionTime, setLastActionTime] = useState<number>(0);

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
      // En caso de error, resetear el contador
      setUnreadCount(0);
    }
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await NotificationService.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        // Verificar desde el servidor para asegurar sincronización
        setTimeout(() => {
          fetchUnreadCount();
        }, 100);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [fetchUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      setTimeout(() => {
        fetchUnreadCount();
      }, 100);
    } catch (err: any) {
      setError(err.message);
    }
  }, [fetchUnreadCount]);

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

  // Eliminar todas las notificaciones
  const deleteAllNotifications = useCallback(async () => {
    try {
      // Marcar el tiempo de la acción
      setLastActionTime(Date.now());

      // Actualizar inmediatamente el estado local
      setNotifications([]);
      setUnreadCount(0);

      // Llamada al servidor
      await NotificationService.deleteAllNotifications();
    } catch (err: any) {
      setError(err.message);
      // En caso de error, refrescar desde el servidor
      fetchNotifications(1);
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (isMounted) {
      // Solo hacer polling si hay token
      const token = localStorage.getItem("token");
      if (token) {
        fetchUnreadCount();
        const interval = setInterval(() => {
          // Verificar token antes de cada polling
          const currentToken = localStorage.getItem("token");
          if (currentToken) {
            fetchUnreadCount();
          }
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setUnreadCount(0);
        setNotifications([]);
      }
    }
  }, [fetchUnreadCount, isMounted]);

  return {
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
  };
}
