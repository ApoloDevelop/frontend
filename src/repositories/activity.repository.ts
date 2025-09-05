import { ActivityPost } from "@/types/activity";
import { authHeaders } from "@/utils/auth";
const B = process.env.NEXT_PUBLIC_BACKEND_URL;

type Page<T> = { items: T[]; nextCursor: number | null };

export class ActivityRepository {
  static async create(payload: {
    itemType: "artist" | "album" | "track";
    name: string;
    artistName?: string;
    albumName?: string;
    content?: string;
  }) {
    const res = await fetch(`${B}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok)
      throw new Error(
        await res.text().catch(() => "No se pudo publicar la actividad")
      );
    return res.json() as Promise<ActivityPost>;
  }

  static async listByUser(userId: number, skip = 0, take = 10) {
    const q = new URLSearchParams({ skip: String(skip), take: String(take) });
    const res = await fetch(`${B}/users/${userId}/activity?${q}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudo cargar la actividad");
    return res.json() as Promise<Page<ActivityPost>>;
  }

  static async remove(postId: number) {
    const res = await fetch(`${B}/activity/${postId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("No se pudo borrar la publicación");
    return res.json();
  }
}
