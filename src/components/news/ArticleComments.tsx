import CommentsSection from "./CommentsSection";

interface ArticleCommentsProps {
  articleId: number;
  currentUserId: number;
}

export function ArticleComments({
  articleId,
  currentUserId,
}: ArticleCommentsProps) {
  return (
    <section className="pt-6 border-t">
      <h2 className="text-xl font-semibold mb-3">Comentarios</h2>
      <CommentsSection articleId={articleId} currentUserId={currentUserId} />
    </section>
  );
}
