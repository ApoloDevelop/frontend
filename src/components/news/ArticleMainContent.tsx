import { ArticleContent } from "./ArticleContent";
import { ArticleComments } from "./ArticleComments";

interface ArticleMainContentProps {
  content: string;
  articleId: number;
  currentUserId: number;
}

export function ArticleMainContent({
  content,
  articleId,
  currentUserId,
}: ArticleMainContentProps) {
  return (
    <main className="col-span-12 lg:col-span-8 space-y-8">
      <ArticleContent content={content} />
      <ArticleComments articleId={articleId} currentUserId={currentUserId} />
    </main>
  );
}
