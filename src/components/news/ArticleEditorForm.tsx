// src/components/news/ArticleEditorForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArticlesService } from "@/services/articles.service";
import { CloudinaryService } from "@/services/cloudinary.service";
import { HeroImageUploader } from "./HeroImageUploader";
import type { InitialData, TagDraft } from "@/types/article";
import { TagPicker } from "./TagPicker";
import { toPayloadTags } from "@/utils/articles";
import { Button } from "../ui/button";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export function ArticleEditorForm({
  authorId,
  editId,
  initial,
}: {
  authorId: number;
  editId?: number;
  initial?: InitialData;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [content, setContent] = useState(initial?.content ?? ""); // HTML

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Para crear
  const [tags, setTags] = useState<TagDraft[]>(initial?.tags ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);

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

  // Subida de imagen al backend e inserción en el editor
  function imageHandler(this: any) {
    const quill = this.quill as any;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setError(null);
        const url = await CloudinaryService.uploadImage(file);
        const range = quill.getSelection(true);
        quill.insertEmbed(range?.index ?? 0, "image", url, "user");
        quill.setSelection((range?.index ?? 0) + 1);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo subir la imagen.");
      }
    };
  }

  function addTag(t: TagDraft) {
    setTags((prev) => {
      const exist = prev.some(
        (x) =>
          x.type === t.type &&
          x.name.toLowerCase() === t.name.toLowerCase() &&
          (x.artistName ?? "").toLowerCase() ===
            (t.artistName ?? "").toLowerCase()
      );
      if (exist) return prev;
      return [...prev, t];
    });
  }

  function removeTag(idx: number) {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  }

  // Toolbar + handlers
  const quillModules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video", "formula"],
      ],
      handlers: { image: imageHandler },
    },
    clipboard: { matchVisual: false },
  };

  const quillFormats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
    "formula",
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  const isEdit = !!editId;

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-live="polite">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          {isEdit ? "Título" : "Título *"}
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

      <HeroImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        targetWidth={1600}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          {isEdit ? "Cuerpo del artículo" : "Cuerpo del artículo *"}
        </label>
        <div className="quill-root relative rounded-lg border overflow-visible">
          <ReactQuill
            className="quill"
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Cuenta la historia…"
            bounds=".quill-root"
          />
        </div>
        <p className="text-xs text-gray-500">
          Da formato (encabezados, negrita, listas, enlaces, imágenes…). Se
          guardará como HTML.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TAGS */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Tags {editId ? "" : "(opcional)"}
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span
              key={`${t.type}-${t.name}-${t.artistName ?? ""}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              title={
                t.artistName
                  ? `${t.type} · ${t.name} · ${t.artistName}`
                  : `${t.type} · ${t.name}`
              }
            >
              <span className="capitalize">{t.type}</span>
              <span>·</span>
              <span className="font-medium">{t.name}</span>
              {t.artistName ? (
                <span className="text-gray-500">({t.artistName})</span>
              ) : null}
              <button
                type="button"
                className="ml-1 rounded-full px-2 py-0.5 hover:bg-black/5"
                onClick={() => removeTag(i)}
                aria-label="Eliminar tag"
              >
                ×
              </button>
            </span>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm rounded-xl border px-4 py-0.5 cursor-pointer hover:bg-black/5"
            onClick={() => setPickerOpen(true)}
          >
            + Añadir tags
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Etiqueta por artista, álbum o canción para enlazar contenido en Apolo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="inline-flex cursor-pointer items-center rounded-xl px-4 py-2 disabled:opacity-50 transition"
        >
          {submitting
            ? isEdit
              ? "Guardando…"
              : "Publicando…"
            : isEdit
            ? "Guardar cambios"
            : "Publicar"}
        </Button>
        <Button
          type="button"
          onClick={() =>
            isEdit ? router.push(`/news/${editId}`) : router.push("/news")
          }
          className="inline-flex cursor-pointer items-center rounded-xl px-4 py-2 border hover:bg-red-500 transition"
        >
          Cancelar
        </Button>
      </div>

      <TagPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={addTag}
      />
    </form>
  );
}
