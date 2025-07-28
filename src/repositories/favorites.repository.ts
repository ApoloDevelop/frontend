export class FavoriteRepository {
  static async fetchIsFavorite(
    artistName: string,
    userId: number
  ): Promise<boolean> {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/favorites?artistName=${encodeURIComponent(
        artistName
      )}&userId=${userId}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) throw new Error("No se pudo obtener el estado de favorito");
    const data: { isFavorite: boolean } = await res.json();
    return data.isFavorite;
  }

  static async postAddFavorite(
    artistName: string,
    userId: number
  ): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName, user: userId }),
      }
    );
    if (!res.ok) throw new Error("No se pudo añadir a favoritos");
  }

  static async deleteRemoveFavorite(
    artistName: string,
    userId: number
  ): Promise<void> {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/favorites?artistName=${encodeURIComponent(
        artistName
      )}&userId=${userId}`,
      { method: "DELETE", headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) throw new Error("No se pudo eliminar de favoritos");
  }
}
