// app/news/[id]/page.tsx
import { useArticleDetailPage } from "@/hooks/news";
import {
  ArticleHero,
  ArticleHeader,
  ArticleMainContent,
  ArticleSidebar,
} from "@/components/news";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { processArticleDetailPage } = useArticleDetailPage();

  const { article, related, author, cover, canEdit, user, articleId } =
    await processArticleDetailPage(id);

  return (
    <div className="container mx-auto">
      <ArticleHero imageUrl={cover} title={article.title} />

      <ArticleHeader
        title={article.title}
        publishedDate={article.published_date}
        author={author}
        articleId={article.id}
        canEdit={canEdit}
      />

      <div className="grid grid-cols-12 gap-6 px-4 pb-16">
        <ArticleMainContent
          content={article.content}
          articleId={articleId}
          currentUser={user}
        />

        <ArticleSidebar relatedArticles={related} tags={article.tags || []} />
      </div>
    </div>
  );
}
