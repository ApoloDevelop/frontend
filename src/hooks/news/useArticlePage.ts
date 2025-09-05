import { useArticlePermissions } from "./useArticlePermissions";
import { useArticleEditor } from "./useArticleEditor";
import type { InitialData } from "@/types/article";
import type { ArticleEditorUser } from "@/types/news";

interface ArticlePageData {
  user: ArticleEditorUser;
  isEdit: boolean;
  initialData?: InitialData;
  editId?: number;
}

export function useArticlePage() {
  const processArticlePage = async (
    edit?: string
  ): Promise<ArticlePageData> => {
    const { user } = await useArticlePermissions();
    const { loadArticleForEdit, formatInitialData } = useArticleEditor();

    let initialArticle: any = null;

    if (edit) {
      initialArticle = await loadArticleForEdit(edit, user.id, user.role_id);
    }

    const isEdit = !!initialArticle;
    const initialData = formatInitialData(initialArticle);

    return {
      user,
      isEdit,
      initialData,
      editId: initialArticle?.id,
    };
  };

  return {
    processArticlePage,
  };
}
