import React from "react";

interface ListItem {
  itemId: number;
}

interface CustomList {
  id: number;
  name: string;
  listItems: ListItem[];
}

interface ListContentProps {
  lists: CustomList[];
  itemLists: number[];
  loading: boolean;
  onAddToList: (listId: number) => void;
  onRemoveFromList: (listId: number) => void;
  onCreateNew: () => void;
}

export function ListContent({
  lists,
  itemLists,
  loading,
  onAddToList,
  onRemoveFromList,
  onCreateNew,
}: ListContentProps) {
  if (loading) {
    return <p>Cargando listas…</p>;
  }

  return (
    <ul className="max-h-60 overflow-y-auto divide-y">
      <li
        className="py-2 px-4 border rounded bg-pink-100 hover:bg-blue-200 cursor-pointer transition font-semibold"
        onClick={onCreateNew}
      >
        + Crear nueva lista
      </li>
      {lists.length > 0 ? (
        lists.map((list) => (
          <ListItem
            key={list.id}
            list={list}
            isInList={itemLists.includes(list.id)}
            onAdd={() => onAddToList(list.id)}
            onRemove={() => onRemoveFromList(list.id)}
          />
        ))
      ) : (
        <p className="py-2 px-4 text-gray-500">No tienes listas aún.</p>
      )}
    </ul>
  );
}

interface ListItemProps {
  list: CustomList;
  isInList: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

function ListItem({ list, isInList, onAdd, onRemove }: ListItemProps) {
  return (
    <li
      className={`py-2 px-4 border rounded hover:bg-gray-200 cursor-pointer transition ${
        isInList ? "bg-green-100" : ""
      }`}
      onClick={isInList ? onRemove : onAdd}
    >
      {list.name}
      {isInList && <span className="ml-2 text-green-600 font-bold">✔</span>}
    </li>
  );
}
