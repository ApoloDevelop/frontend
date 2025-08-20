// src/components/news/ArticleEditorForm.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArticlesService } from "@/services/articles.service";

export function ArticleEditorForm({ authorId }: { authorId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(
    () => title.trim() && content.trim(),
    [title, content]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const created = await ArticlesService.create({
        title: title.trim(),
        content: content.trim(),
        author_id: authorId,
        image_url: imageUrl.trim() || null,
      });
      router.push(`/news/${created.id}`);
    } catch (err: any) {
      setError(err?.message || "Error al crear el artículo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-live="polite">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Título *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Escribe un titular potente…"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="image" className="block text-sm font-medium">
          Imagen de cabecera (URL)
        </label>
        <input
          id="image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="https://…"
        />
        {imageUrl ? (
          <div className="mt-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
              {/* preview segura */}
              <Image
                src={imageUrl}
                alt="Vista previa"
                fill
                className="object-cover"
                onError={() => {
                  /* opcional: set fallback */
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="content" className="block text-sm font-medium">
          Cuerpo del artículo *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 min-h-[240px]"
          placeholder="Cuenta la historia…"
          required
        />
        <p className="text-xs text-gray-500">
          Usa saltos de línea. (Markdown/WYSIWYG opcional en siguientes
          iteraciones)
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="inline-flex items-center rounded-xl px-4 py-2 bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-50 transition"
        >
          {submitting ? "Publicando…" : "Publicar"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/news")}
          className="inline-flex items-center rounded-xl px-4 py-2 border hover:bg-black/5 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
