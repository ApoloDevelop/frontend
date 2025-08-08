export class ReviewRepository {
  static async rateArtist({
    artistName,
    score,
    comment,
    userId,
  }: {
    artistName: string;
    score: number;
    comment?: string;
    userId: number;
  }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/artist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName, score, comment, userId }),
      }
    );
    if (!res.ok) {
      throw new Error("Error al enviar la reseña");
    }
    return await res.json();
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
