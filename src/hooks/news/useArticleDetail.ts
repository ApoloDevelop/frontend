import { ArticlesService } from "@/services/articles.service";
import { UserService } from "@/services/user.service";
import { notFound } from "next/navigation";

export function useArticleDetail() {
  const loadArticleData = async (articleId: number) => {
    if (!Number.isFinite(articleId)) {
      return notFound();
    }

    try {
      const [article, related] = await Promise.all([
        ArticlesService.getById(articleId),
        ArticlesService.getRelated(articleId, 3).catch(() => []),
      ]);

      const author = await UserService.getUserById(article.author_id);

      return {
        article,
        related,
        author,
      };
    } catch {
      return notFound();
    }
  };

  return {
    loadArticleData,
  };
}
