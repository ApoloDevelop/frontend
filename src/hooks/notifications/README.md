# 🎣 Notification Hooks

Este directorio contiene los hooks personalizados para el sistema de notificaciones.

## 📋 Hooks Disponibles

### `useNotifications`

Hook principal que maneja las operaciones de API para notificaciones.

**Retorna:**

- `notifications`: Array de notificaciones
- `loading`: Estado de carga
- `error`: Mensaje de error si existe
- `fetchNotifications`: Función para obtener notificaciones
- `markAsRead`: Marcar una notificación como leída
- `markAllAsRead`: Marcar todas como leídas
- `deleteNotification`: Eliminar una notificación

### `useNotificationPanel`

Maneja la lógica del panel de notificaciones (efectos y referencias DOM).

**Parámetros:**

```typescript
{
  isOpen: boolean;
  onClose: () => void;
  fetchNotifications: (page: number) => void;
}
```

**Retorna:**

- `panelRef`: Referencia del panel para detectar clicks fuera

### `useNotificationNavigation`

Maneja la navegación basada en el tipo de notificación.

**Retorna:**

- `navigateToNotification`: Función que navega según el tipo de notificación

### `useTimeFormatter`

Formatea timestamps a formato de tiempo relativo en español.

**Retorna:**

- `formatTimeAgo`: Función que convierte fecha a texto legible ("hace 5m")

## 🚀 Uso

```typescript
import {
  useNotifications,
  useNotificationPanel,
  useNotificationNavigation,
  useTimeFormatter,
} from "@/hooks/notifications";

function MyComponent() {
  const { notifications, markAsRead } = useNotifications();
  const { formatTimeAgo } = useTimeFormatter();

  // ... resto del componente
}
```
