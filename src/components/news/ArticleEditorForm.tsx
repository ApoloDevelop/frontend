// src/components/news/ArticleEditorForm.tsx
"use client";

import { useEffect } from "react";
import { HeroImageUploader } from "./HeroImageUploader";
import { ArticleTitleInput } from "./ArticleTitleInput";
import { ArticleContentEditor } from "./ArticleContentEditor";
import { ArticleTagsSection } from "./ArticleTagsSection";
import { ArticleFormActions } from "./ArticleFormActions";
import { ErrorDisplay } from "./ErrorDisplay";
import { useArticleForm } from "@/hooks/news/useArticleForm";
import { useTagManager } from "@/hooks/news/useTagManager";
import { useQuillEditor } from "@/hooks/news/useQuillEditor";
import type { InitialData } from "@/types/article";

export function ArticleEditorForm({
  authorId,
  editId,
  initial,
}: {
  authorId: number;
  editId?: number;
  initial?: InitialData;
}) {
  const {
    title,
    setTitle,
    imageUrl,
    setImageUrl,
    content,
    setContent,
    tags,
    setTags,
    submitting,
    error,
    setError,
    isValid,
    isEdit,
    onSubmit,
    onCancel,
  } = useArticleForm(authorId, editId, initial);

  const {
    tags: managedTags,
    setTags: setManagedTags,
    pickerOpen,
    addTag,
    removeTag,
    openPicker,
    closePicker,
  } = useTagManager(tags);

  const {
    error: quillError,
    setError: setQuillError,
    quillModules,
    quillFormats,
  } = useQuillEditor();

  // Sincronizar tags entre los hooks
  useEffect(() => {
    setManagedTags(tags);
  }, [tags, setManagedTags]);

  useEffect(() => {
    setTags(managedTags);
  }, [managedTags, setTags]);

  // Manejar errores del editor Quill
  useEffect(() => {
    if (quillError) {
      setError(quillError);
      setQuillError(null);
    }
  }, [quillError, setError, setQuillError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-live="polite">
      <ArticleTitleInput value={title} onChange={setTitle} isEdit={isEdit} />

      <HeroImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        targetWidth={1600}
      />

      <ArticleContentEditor
        value={content}
        onChange={setContent}
        isEdit={isEdit}
        quillModules={quillModules}
        quillFormats={quillFormats}
      />

      <ErrorDisplay error={error} />

      <ArticleTagsSection
        tags={managedTags}
        isEdit={isEdit}
        pickerOpen={pickerOpen}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onOpenPicker={openPicker}
        onClosePicker={closePicker}
      />

      <ArticleFormActions
        isValid={isValid}
        submitting={submitting}
        isEdit={isEdit}
        onCancel={onCancel}
      />
    </form>
  );
}
