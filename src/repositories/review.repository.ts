export class ReviewRepository {
  static async rate(payload: any) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/rate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Error al enviar la reseña");
    return res.json();
  }

  static async getReviewCounts(artistName: string) {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/artist/count?artistName=${encodeURIComponent(artistName)}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Error al obtener el número de reseñas");
    }
    return await res.json();
  }

  static async getAlbumReviewStats(albumName: string, artistName?: string) {
    const q = new URLSearchParams({ albumName });
    if (artistName) q.set("artistName", artistName);

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/album/stats?${q.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Error al obtener las stats del álbum");
    return res.json() as Promise<{
      verified: number | null;
      unverified: number | null;
      verifiedCount: number;
      unverifiedCount: number;
      itemId: number | null;
    }>;
  }

  static async getReviewsByItem(itemId: number, verified: boolean) {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/artist/reviews?itemId=${itemId}&verified=${verified ? 1 : 0}`
    );
    if (!res.ok) {
      throw new Error("Error al obtener las reseñas");
    }
    return await res.json();
  }
}
