import { authHeaders } from "@/utils/auth";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class FavoriteRepository {
  static async isFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId?: number;
    artistName?: string;
    location?: string;
  }): Promise<boolean> {
    const url = new URL(`${B}/favorites`);
    url.searchParams.set("type", payload.type);
    url.searchParams.set("name", payload.name);
    if (payload.artistName)
      url.searchParams.set("artistName", payload.artistName);
    if (payload.location) url.searchParams.set("location", payload.location);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: authHeaders(),
    });
    if (res.status === 401 || res.status === 403) return false;
    if (!res.ok) throw new Error("Error buscando el estado de favorito");

    const data = await res.json();
    return !!data?.isFavorite;
  }

  static async addFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId?: number;
    artistName?: string;
    location?: string;
  }): Promise<void> {
    const { userId: _ignore, ...rest } = payload;
    const res = await fetch(`${B}/favorites`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(rest),
    });
    if (!res.ok)
      throw new Error(await res.text().catch(() => "Error añadiendo favorito"));
  }

  static async removeFavorite(payload: {
    type: "album" | "track" | "venue" | "artist";
    name: string;
    userId?: number;
    artistName?: string;
    location?: string;
  }): Promise<void> {
    const url = new URL(`${B}/favorites`);
    url.searchParams.set("type", payload.type);
    url.searchParams.set("name", payload.name);
    if (payload.artistName)
      url.searchParams.set("artistName", payload.artistName);
    if (payload.location) url.searchParams.set("location", payload.location);

    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok)
      throw new Error(
        await res.text().catch(() => "Error eliminando favorito")
      );
  }

  static async getAllUserFavorites(): Promise<any[]> {
    const res = await fetch(`${B}/favorites/all`, {
      cache: "no-store",
      headers: authHeaders(),
    });
    if (res.status === 401 || res.status === 403) return [];
    if (!res.ok) throw new Error("Error obteniendo favoritos del usuario");

    return await res.json();
  }
}
