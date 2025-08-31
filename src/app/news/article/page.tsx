// app/news/new/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArticleEditorForm } from "@/components/news/ArticleEditorForm";

export default async function NewArticlePage() {
  const user = await getCurrentUser();
  if (!user || ![1, 2, 3].includes(user.role_id)) {
    redirect("/news");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Nuevo artículo</h1>
      <p className="text-gray-600 mb-6">
        Redacta un nuevo artículo para la portada.
      </p>

      <div className="rounded-2xl border bg-white p-5">
        <ArticleEditorForm authorId={user.id} />
      </div>
    </div>
  );
}
