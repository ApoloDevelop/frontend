// src/components/news/TagPicker.tsx
"use client";

import { TagPickerModal } from "./TagPickerModal";
import { TagPickerHeader } from "./TagPickerHeader";
import { TagPickerSearchResults } from "./TagPickerSearchResults";
import { useTagPickerSearch } from "@/hooks/news/useTagPickerSearch";
import { TagDraft } from "@/types/article";

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
    <TagPickerModal open={open} onClose={onClose}>
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
    </TagPickerModal>
  );
}
