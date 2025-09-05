import { ArticleEditorForm } from "./ArticleEditorForm";
import type { InitialData } from "@/types/article";

interface ArticleEditorContainerProps {
  authorId: number;
  editId?: number;
  initialData?: InitialData;
}

export function ArticleEditorContainer({
  authorId,
  editId,
  initialData,
}: ArticleEditorContainerProps) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <ArticleEditorForm
        authorId={authorId}
        editId={editId}
        initial={initialData}
      />
    </div>
  );
}
