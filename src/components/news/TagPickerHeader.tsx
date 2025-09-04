// src/components/news/TagPickerHeader.tsx
"use client";

import { RefObject } from "react";

interface TagPickerHeaderProps {
  q: string;
  setQ: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
}

export function TagPickerHeader({
  q,
  setQ,
  inputRef,
  onClose,
}: TagPickerHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca artista, álbum o canción…"
        className="flex-1 rounded-md border px-3 py-2 outline-none"
        aria-label="Buscar para añadir tag"
      />
      <button
        className="rounded-md border px-3 py-2 hover:bg-black/5 cursor-pointer"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
}
