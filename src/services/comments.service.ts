import { CommentsService as Repository } from "@/repositories/comments.repository";
import type { Comment, CommentListResponse } from "@/types/comment";

export class CommentsService {
  static async listByArticle(
    articleId: number,
    params?: { limit?: number; cursor?: number }
  ): Promise<CommentListResponse> {
    return await Repository.listByArticle(articleId, params);
  }

  static async create(
    articleId: number,
    content: string,
    userId: number,
    parent_id?: number
  ): Promise<Comment> {
    return await Repository.create(articleId, content, userId, parent_id);
  }

  static async remove(
    commentId: number,
    userId: number
  ): Promise<{ id: number; deleted: true }> {
    return await Repository.remove(commentId, userId);
  }
}
