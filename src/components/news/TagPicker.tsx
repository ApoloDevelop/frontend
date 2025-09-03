// src/components/news/TagPicker.tsx
"use client";

import { TagPickerHeader } from "./TagPickerHeader";
import { TagPickerSearchResults } from "./TagPickerSearchResults";
import { useTagPickerSearch } from "@/hooks/news/useTagPickerSearch";
import { TagDraft } from "@/types/article";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function TagPicker({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: TagDraft) => void;
}) {
  const { q, setQ, loading, artists, albums, tracks, inputRef } =
    useTagPickerSearch(open);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[900px] max-h-[85vh] overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Buscar artista, álbum o canción
        </DialogTitle>
        <TagPickerHeader
          q={q}
          setQ={setQ}
          inputRef={inputRef}
          onClose={onClose}
        />
        <TagPickerSearchResults
          loading={loading}
          artists={artists}
          albums={albums}
          tracks={tracks}
          q={q}
          onAdd={onAdd}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
