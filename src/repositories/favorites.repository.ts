export class FavoriteRepository {
  static async isFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId: number;
    artistName?: string;
    location?: string;
  }): Promise<boolean> {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites?userId=${payload.userId}`
    );
    url.searchParams.set("type", payload.type);
    url.searchParams.set("name", payload.name);
    url.searchParams.set("userId", String(payload.userId));
    if (payload.artistName)
      url.searchParams.set("artistName", payload.artistName);
    if (payload.location) url.searchParams.set("location", payload.location);

    console.log(url.toString());
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("Error buscando el estado de favorito");
    const data = await res.json();
    return !!data?.isFavorite;
  }

  static async addFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId: number;
    artistName?: string;
    location?: string;
  }): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Error añadiendo favorito");
  }

  static async removeFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId: number;
    artistName?: string;
    location?: string;
  }): Promise<void> {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites`);
    url.searchParams.set("type", payload.type);
    url.searchParams.set("name", payload.name);
    url.searchParams.set("userId", String(payload.userId));
    if (payload.artistName)
      url.searchParams.set("artistName", payload.artistName);
    if (payload.location) url.searchParams.set("location", payload.location);

    const res = await fetch(url.toString(), { method: "DELETE" });
    if (!res.ok) throw new Error("Error eliminando favorito");
  }
}
