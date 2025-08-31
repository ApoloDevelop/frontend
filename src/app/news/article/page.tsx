// app/news/article/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArticleEditorForm } from "@/components/news/ArticleEditorForm";
import { ArticlesService } from "@/services/articles.service";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  const user = await getCurrentUser();
  if (!user || ![1, 2, 3].includes(user.role_id)) {
    redirect("/news");
  }

  // Si viene ?edit, cargamos el artículo y comprobamos permisos (writer solo su propio artículo)
  let initialArticle: Awaited<
    ReturnType<typeof ArticlesService.getById>
  > | null = null;

  if (edit) {
    const editId = Number(edit);
    if (!Number.isFinite(editId)) redirect("/news");

    try {
      initialArticle = await ArticlesService.getById(editId);
    } catch {
      redirect("/news");
    }

    if (user.role_id === 3 && initialArticle.author_id !== user.id) {
      redirect("/news");
    }
  }

  const isEdit = !!initialArticle;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {isEdit ? "Editar artículo" : "Nuevo artículo"}
      </h1>
      <p className="text-gray-600 mb-6">
        {isEdit
          ? "Modifica el contenido y guarda los cambios."
          : "Redacta un nuevo artículo para la portada."}
      </p>

      <div className="rounded-2xl border bg-white p-5">
        <ArticleEditorForm
          authorId={user.id}
          editId={initialArticle?.id}
          initial={
            initialArticle
              ? {
                  title: initialArticle.title,
                  image_url: initialArticle.image_url ?? "",
                  content: initialArticle.content,
                  tags:
                    (initialArticle as any).tags?.map(
                      ({ type, name, artistName, albumName }: any) => ({
                        type,
                        name,
                        ...(artistName ? { artistName } : {}),
                        ...(albumName ? { albumName } : {}),
                      })
                    ) ?? [],
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
