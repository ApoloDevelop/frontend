// src/components/news/ArticleTagsSection.tsx
"use client";

import type { TagDraft } from "@/types/article";
import { TagPicker } from "./TagPicker";

interface ArticleTagsSectionProps {
  tags: TagDraft[];
  isEdit: boolean;
  pickerOpen: boolean;
  onAddTag: (tag: TagDraft) => void;
  onRemoveTag: (index: number) => void;
  onOpenPicker: () => void;
  onClosePicker: () => void;
}

export function ArticleTagsSection({
  tags,
  isEdit,
  pickerOpen,
  onAddTag,
  onRemoveTag,
  onOpenPicker,
  onClosePicker,
}: ArticleTagsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Tags {isEdit ? "" : "(opcional)"}
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
                onClick={() => onRemoveTag(i)}
                aria-label="Eliminar tag"
              >
                ×
              </button>
            </span>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm rounded-xl border px-4 py-0.5 cursor-pointer hover:bg-black/5"
            onClick={onOpenPicker}
          >
            + Añadir tags
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Etiqueta por artista, álbum o canción para enlazar contenido en Apolo.
        </p>
      </div>

      <TagPicker open={pickerOpen} onClose={onClosePicker} onAdd={onAddTag} />
    </>
  );
}
