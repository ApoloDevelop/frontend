export class ReviewRepository {
  static async rateArtist({
    artistName,
    score,
    comment,
    userId,
    birthdate,
  }: {
    artistName: string;
    score: number;
    comment?: string;
    userId: number;
    birthdate?: Date;
  }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/artist`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName, score, comment, userId, birthdate }),
      }
    );
    if (!res.ok) {
      throw new Error("Error al enviar la reseña");
    }
    return await res.json();
  }
}
