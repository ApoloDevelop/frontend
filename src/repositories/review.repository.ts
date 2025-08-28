import { ReviewWithVotes } from "@/types/reviews";

type Page<T> = { items: T[]; nextCursor: number | null };

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

  static async getReviewsByItem(
    itemId: number,
    verified: boolean,
    userId?: number,
    take = 10,
    cursor?: number
  ) {
    const q = new URLSearchParams({
      itemId: String(itemId),
      verified: verified ? "1" : "0",
      take: String(take),
    });
    if (userId != null) q.set("userId", String(userId));
    if (cursor != null) q.set("cursor", String(cursor));

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/reviews/item/reviews?${q.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Error al obtener las reseñas");
    return (await res.json()) as Page<ReviewWithVotes>;
  }

  static async voteReview(reviewId: number, value: 1 | -1, userId: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, value, userId }),
      }
    );
    if (!res.ok)
      throw new Error(
        await res.text().catch(() => "No se pudo votar la reseña")
      );
    return res.json();
  }
}
