import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ArticleEditorPermissions } from "@/types/news";

export async function useArticlePermissions(): Promise<ArticleEditorPermissions> {
  const user = await getCurrentUser();

  // Verificar permisos: solo roles 1, 2, 3 pueden crear/editar artículos
  if (!user || ![1, 2, 3].includes(user.role_id)) {
    redirect("/news");
  }

  return {
    user: {
      id: user.id,
      role_id: user.role_id,
    },
    canEdit: true, // Si se llega aquí, el usuario tiene permisos
    isWriter: user.role_id === 3,
    isEditor: user.role_id === 2,
    isAdmin: user.role_id === 1,
  };
}
