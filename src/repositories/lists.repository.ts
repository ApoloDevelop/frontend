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
}
