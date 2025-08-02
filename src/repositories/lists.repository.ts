export class ListRepository {
  static async getUserLists(
    userId: number,
    itemType?: string
  ): Promise<{ id: number; name: string }[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lists`);
    url.searchParams.append("userId", userId.toString());
    if (itemType) {
      url.searchParams.append("itemType", itemType);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error("Error al obtener las listas del usuario");
    }
    return await res.json();
  }

  static async createList(
    userId: number,
    name: string,
    itemType?: string
  ): Promise<{ id: number; name: string }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, itemType }),
    });

    if (!res.ok) {
      throw new Error("Error al crear la lista");
    }

    return await res.json();
  }

  static async addItemToList(listId: number, itemId: number): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/lists/add-item`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, itemId }),
      }
    );

    if (!res.ok) {
      throw new Error("Error al añadir el ítem a la lista");
    }
  }

  static async removeItemFromList(
    listId: number,
    itemId: number
  ): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/lists/remove-item`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, itemId }),
      }
    );

    if (!res.ok) {
      throw new Error("Error al eliminar el ítem de la lista");
    }
  }
}
