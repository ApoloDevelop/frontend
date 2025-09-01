import CommentsSection from "./CommentsSection";
import type { AuthUser } from "@/types/auth";

interface ArticleCommentsProps {
  articleId: number;
  currentUser: AuthUser | null;
}

export function ArticleComments({
  articleId,
  currentUser,
}: ArticleCommentsProps) {
  return (
    <section className="pt-6 border-t">
      <h2 className="text-xl font-semibold mb-3">Comentarios</h2>
      <CommentsSection articleId={articleId} currentUser={currentUser} />
    </section>
  );
}
