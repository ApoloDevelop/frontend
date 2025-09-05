import { useArticleDetail } from "./useArticleDetail";
import { useArticleDetailPermissions } from "./useArticleDetailPermissions";

export function useArticleDetailPage() {
  const processArticleDetailPage = async (id: string) => {
    const articleId = Number(id);
    const { loadArticleData } = useArticleDetail();
    const { getEditPermissions } = await useArticleDetailPermissions();

    const { article, related, author } = await loadArticleData(articleId);
    const { canEdit, user } = getEditPermissions(article.author_id);

    const cover = article.image_url || "/default-cover.png";

    return {
      article,
      related,
      author,
      cover,
      canEdit,
      user,
      articleId,
    };
  };

  return {
    processArticleDetailPage,
  };
}
