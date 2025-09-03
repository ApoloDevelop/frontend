// src/components/news/ArticleFormActions.tsx
"use client";

import { Button } from "../ui/button";

interface ArticleFormActionsProps {
  isValid: boolean;
  submitting: boolean;
  isEdit: boolean;
  onCancel: () => void;
}

export function ArticleFormActions({
  isValid,
  submitting,
  isEdit,
  onCancel,
}: ArticleFormActionsProps) {
  return (
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
        onClick={onCancel}
        className="inline-flex cursor-pointer items-center rounded-xl px-4 py-2 border hover:bg-red-500 transition"
      >
        Cancelar
      </Button>
    </div>
  );
}
