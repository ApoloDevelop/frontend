import { ArticleContent } from "./ArticleContent";
import { ArticleComments } from "./ArticleComments";
import { AuthUser } from "@/types/auth";

interface ArticleMainContentProps {
  content: string;
  articleId: number;
  currentUser: AuthUser | null;
}

export function ArticleMainContent({
  content,
  articleId,
  currentUser,
}: ArticleMainContentProps) {
  return (
    <main className="col-span-12 lg:col-span-8 space-y-8">
      <ArticleContent content={content} />
      <ArticleComments articleId={articleId} currentUser={currentUser} />
    </main>
  );
}
