import { authHeaders } from "@/utils/auth";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ListRepository {
  static async getUserLists(
    itemType?: string
  ): Promise<{ id: number; name: string }[]> {
    const url = new URL(`${B}/lists`);
    if (itemType) {
      url.searchParams.append("itemType", itemType);
    }

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: authHeaders(),
    });
    if (res.status === 401 || res.status === 403) return []; // no logueado => sin listas
    if (!res.ok) throw new Error("Error al obtener las listas del usuario");
    return await res.json();
  }

  static async createList(
    name: string,
    itemType?: string
  ): Promise<{ id: number; name: string }> {
    const res = await fetch(`${B}/lists`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, itemType }),
    });

    if (!res.ok) {
      throw new Error("Error al crear la lista");
    }

    return await res.json();
  }

  static async addItemToList(listId: number, itemId: number): Promise<void> {
    const res = await fetch(`${B}/lists/add-item`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ listId, itemId }),
    });

    if (!res.ok) {
      throw new Error("Error al añadir el ítem a la lista");
    }
  }

  static async removeItemFromList(
    listId: number,
    itemId: number
  ): Promise<void> {
    const res = await fetch(`${B}/lists/remove-item`, {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ listId, itemId }),
    });

    if (!res.ok) {
      throw new Error("Error al eliminar el ítem de la lista");
    }
  }

  static async getListById(listId: number): Promise<any> {
    const res = await fetch(`${B}/lists/${listId}`, {
      cache: "no-store",
      headers: authHeaders(),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("No tienes acceso a esta lista");
    }
    if (!res.ok) {
      throw new Error("Error al obtener la lista");
    }

    return await res.json();
  }

  static async deleteList(listId: number): Promise<void> {
    const res = await fetch(`${B}/lists/${listId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Error al eliminar la lista");
    }
  }

  static async updateListName(listId: number, name: string): Promise<any> {
    const res = await fetch(`${B}/lists/${listId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar el nombre de la lista");
    }

    return await res.json();
  }
}
