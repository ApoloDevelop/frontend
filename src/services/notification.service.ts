import { Notification, NotificationResponse } from "@/types/notifications";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export class NotificationService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  static async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationResponse> {
    if (!this.isAuthenticated()) {
      return {
        notifications: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }

    const response = await fetch(
      `${API_URL}/notifications?page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        return {
          notifications: [],
          total: 0,
          page: 1,
          totalPages: 0,
        };
      }
      throw new Error("Error al obtener notificaciones");
    }

    return response.json();
  }

  static async getUnreadCount(): Promise<number> {
    if (!this.isAuthenticated()) {
      return 0;
    }

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem("token");
        return 0;
      }
      throw new Error("Error al obtener contador de notificaciones");
    }

    return response.json();
  }

  static async markAsRead(notificationId: number): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        return;
      }
      throw new Error("Error al marcar notificación como leída");
    }
  }

  static async markAllAsRead(): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        return;
      }
      throw new Error("Error al marcar todas las notificaciones como leídas");
    }
  }

  static async deleteNotification(notificationId: number): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        return;
      }
      throw new Error("Error al eliminar notificación");
    }
  }
}
