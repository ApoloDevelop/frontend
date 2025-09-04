# Lista de Componentes - Refactorización

Esta refactorización divide el componente monolítico `ListDetailDialog` en componentes más pequeños y manejables, siguiendo el principio de responsabilidad única.

## Estructura de archivos

```
src/
├── components/lists/
│   ├── index.ts                    # Exportaciones principales
│   ├── ListDetailDialog.tsx        # Componente principal (refactorizado)
│   ├── EditableListHeader.tsx      # Header editable con nombre de lista
│   ├── ListControls.tsx            # Controles de búsqueda y ordenamiento
│   ├── ListItemCard.tsx            # Tarjeta individual para cada item
│   ├── ListItemsGrid.tsx           # Grid contenedor de items
│   └── ListTagPicker.tsx           # Componente existente para añadir items
├── hooks/lists/
│   ├── index.ts                    # Exportaciones de hooks
│   ├── useListDetail.ts            # Lógica principal de la lista
│   └── useItemCovers.ts            # Manejo de covers de Spotify
└── utils/
    └── listItemUtils.tsx           # Utilidades para iconos y etiquetas
```

## Componentes

### `ListDetailDialog` (Principal)
- **Responsabilidad**: Coordinar la lógica y renderizar el diálogo
- **Dependencias**: Todos los subcomponentes y hooks
- **Estado**: Mínimo, delegado a los hooks

### `EditableListHeader`
- **Responsabilidad**: Renderizar y manejar la edición del nombre de la lista
- **Props**: 
  - `name`: Nombre actual
  - `editingName`: Estado de edición
  - `newName`: Nuevo nombre temporal
  - `setNewName`: Función para actualizar el nombre
  - `setEditingName`: Función para cambiar modo de edición
  - `onUpdateName`: Callback para guardar cambios
  - `onCancelEdit`: Callback para cancelar edición

### `ListControls`
- **Responsabilidad**: Renderizar controles de búsqueda, ordenamiento y añadir elementos
- **Props**:
  - `searchQuery`: Término de búsqueda
  - `setSearchQuery`: Función para actualizar búsqueda
  - `sortOrder`: Orden actual ("asc" | "desc")
  - `setSortOrder`: Función para cambiar orden
  - `onAddItem`: Callback para añadir elemento
  - `addingItem`: Estado de carga al añadir

### `ListItemCard`
- **Responsabilidad**: Renderizar un item individual de la lista
- **Props**:
  - `item`: Datos del item
  - `itemType`: Tipo de item ("artist" | "album" | "track")
  - `coverUrl`: URL del cover
  - `onRemove`: Callback para eliminar item

### `ListItemsGrid`
- **Responsabilidad**: Renderizar la lista completa de items
- **Props**:
  - `items`: Array de items filtrados
  - `itemType`: Tipo de items
  - `searchQuery`: Para mostrar mensaje cuando no hay resultados
  - `getCoverUrl`: Función para obtener URL del cover
  - `onRemoveItem`: Callback para eliminar item

## Custom Hooks

### `useListDetail`
- **Responsabilidad**: Lógica principal de manejo de la lista
- **Funcionalidades**:
  - Carga de detalles de la lista
  - Filtrado y ordenamiento
  - Edición del nombre
  - Añadir/eliminar items
  - Estados de carga

**Returns**:
```typescript
{
  list: ListDetail | null;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  editingName: boolean;
  setEditingName: (editing: boolean) => void;
  newName: string;
  setNewName: (name: string) => void;
  addingItem: boolean;
  filteredItems: ListItem[];
  fetchListDetails: () => Promise<ListDetail>;
  handleUpdateName: () => Promise<void>;
  handleRemoveItem: (itemId: number, itemName: string) => Promise<void>;
  handleAddItem: (tag: TagDraft) => Promise<ListDetail | undefined>;
}
```

### `useItemCovers`
- **Responsabilidad**: Manejo de covers de Spotify para los items
- **Funcionalidades**:
  - Carga de covers desde Spotify API
  - Cache de covers cargados
  - Manejo de errores con fallback

**Returns**:
```typescript
{
  itemCovers: Record<number, string>;
  loadCovers: (items: ListItem[], itemType: ItemType2) => Promise<void>;
  getCoverUrl: (item: ListItem) => string;
}
```

## Utilidades

### `listItemUtils.tsx`
Funciones de utilidad para renderizar iconos y etiquetas según el tipo de item:
- `getTypeIcon(type: ItemType2)`: Retorna el icono correspondiente
- `getTypeLabel(type: ItemType2)`: Retorna la etiqueta en español

## Ventajas de la refactorización

1. **Separación de responsabilidades**: Cada componente tiene una función específica
2. **Reutilización**: Los subcomponentes pueden reutilizarse en otros contextos
3. **Mantenibilidad**: Más fácil encontrar y modificar funcionalidades específicas
4. **Testeo**: Cada componente y hook puede probarse independientemente
5. **Legibilidad**: El código es más fácil de entender y seguir
6. **Performance**: Mejor control de re-renders al dividir el estado

## Uso

```tsx
import { ListDetailDialog } from '@/components/lists';

// El componente se usa igual que antes
<ListDetailDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  listId={selectedListId}
  onListUpdated={handleListUpdate}
/>
```

Los hooks también pueden usarse independientemente:

```tsx
import { useListDetail, useItemCovers } from '@/hooks/lists';

function MyComponent() {
  const listLogic = useListDetail({ listId, open, onListUpdated });
  const covers = useItemCovers();
  
  // Usar la lógica según necesidades...
}
```
