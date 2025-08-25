import type { Comment, CommentListResponse } from "@/types/comment";

const B = process.env.NEXT_PUBLIC_BACKEND_URL; // Nest base URL

export class CommentsService {
  static async listByArticle(
    articleId: number,
    params?: { limit?: number; cursor?: number }
  ) {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.cursor) qs.set("cursor", String(params.cursor));

    const res = await fetch(
      `${B}/articles/${articleId}/comments?${qs.toString()}`,
      {
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) throw new Error("Error cargando comentarios");
    return (await res.json()) as CommentListResponse;
  }

  static async create(
    articleId: number,
    content: string,
    userId: number,
    parent_id?: number
  ) {
    const res = await fetch(`${B}/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, content, parent_id }),
    });
    if (!res.ok) throw new Error("Error publicando comentario");
    return (await res.json()) as Comment;
  }

  static async remove(commentId: number, userId: number) {
    const res = await fetch(`${B}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!res.ok) throw new Error("Error eliminando comentario");
    return (await res.json()) as { id: number; deleted: true };
  }
}
