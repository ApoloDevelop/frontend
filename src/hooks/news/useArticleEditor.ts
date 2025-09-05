import { ArticlesService } from "@/services/articles.service";
import { redirect } from "next/navigation";
import type { InitialData, TagDraft, TagType } from "@/types/article";

export function useArticleEditor() {
  const loadArticleForEdit = async (
    editId: string,
    userId: number,
    userRoleId: number
  ) => {
    const editIdNumber = Number(editId);
    if (!Number.isFinite(editIdNumber)) {
      redirect("/news");
    }

    try {
      const article = await ArticlesService.getById(editIdNumber);

      // Solo redactores (role 3) no pueden editar artículos de otros
      if (userRoleId === 3 && article.author_id !== userId) {
        redirect("/news");
      }

      return article;
    } catch {
      redirect("/news");
    }
  };

  const formatInitialData = (article: any): InitialData | undefined => {
    if (!article) return undefined;

    return {
      title: article.title,
      image_url: article.image_url ?? "",
      content: article.content,
      tags:
        article.tags?.map(
          ({ type, name, artistName, albumName }: any): TagDraft => ({
            type: type as TagType,
            name,
            ...(artistName ? { artistName } : {}),
            ...(albumName ? { albumName } : {}),
          })
        ) ?? [],
    };
  };

  return {
    loadArticleForEdit,
    formatInitialData,
  };
}
