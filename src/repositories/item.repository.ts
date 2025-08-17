// repositories/item.repository.ts
export class ItemRepository {
  static async findItemByTypeAndName(
    type: "artist" | "album" | "track" | "venue",
    name: string,
    ctx?: { artistName?: string; location?: string }
  ): Promise<{ itemId: number } | null> {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item/find`);
    url.searchParams.set("type", type);
    url.searchParams.set("name", name);
    if (ctx?.artistName) url.searchParams.set("artistName", ctx.artistName);
    if (ctx?.location) url.searchParams.set("location", ctx.location);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      let msg = "Error al buscar el ítem";
      try {
        const err = await res.json();
        msg = err?.message || msg;
      } catch {}
      throw new Error(msg);
    }

    return res.json();
  }
}
