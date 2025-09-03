// src/hooks/news/useArticleForm.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticlesService } from "@/services/articles.service";
import type { InitialData, TagDraft } from "@/types/article";
import { toPayloadTags } from "@/utils/articles";

export function useArticleForm(
  authorId: number,
  editId?: number,
  initial?: InitialData
) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState<TagDraft[]>(initial?.tags ?? []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si cambia initial (navegación entre artículos), refrescamos estados
  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? "");
      setImageUrl(initial.image_url ?? "");
      setContent(initial.content ?? "");
      setTags(toPayloadTags(initial.tags ?? []));
    }
  }, [initial]);

  // Validación simple para evitar HTML vacío tipo <p><br></p>
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  const isValid = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    const hasBody = stripHtml(content).length > 0;
    return hasTitle && hasBody;
  }, [title, content]);

  const isEdit = !!editId;

  async function onSubmit() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    const cleanTags = toPayloadTags(tags);

    try {
      if (editId) {
        await ArticlesService.update(editId, {
          title: title.trim(),
          content: content,
          image_url: imageUrl.trim() || null,
          tags: cleanTags,
        });
        router.push(`/news/${editId}`);
        router.refresh();
      } else {
        const created = await ArticlesService.create({
          title: title.trim(),
          content: content,
          author_id: authorId,
          image_url: imageUrl.trim() || null,
          tags: cleanTags,
        });
        router.push(`/news/${created.id}`);
      }
    } catch (err: any) {
      setError(err?.message || "Error al guardar el artículo");
    } finally {
      setSubmitting(false);
    }
  }

  function onCancel() {
    if (isEdit) {
      router.push(`/news/${editId}`);
    } else {
      router.push("/news");
    }
  }

  return {
    // State
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

    // Computed
    isValid,
    isEdit,

    // Actions
    onSubmit,
    onCancel,
  };
}
