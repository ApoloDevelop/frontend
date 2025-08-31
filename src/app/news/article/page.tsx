// app/news/article/page.tsx
import { useArticlePage } from "@/hooks/news/useArticlePage";
import { ArticleEditorHeader, ArticleEditorContainer } from "@/components/news";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const { processArticlePage } = useArticlePage();

  const { user, isEdit, initialData, editId } = await processArticlePage(edit);

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleEditorHeader isEdit={isEdit} />
      <ArticleEditorContainer
        authorId={user.id}
        editId={editId}
        initialData={initialData}
      />
    </div>
  );
}
