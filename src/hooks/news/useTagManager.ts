// src/hooks/news/useTagManager.ts
"use client";

import { useState } from "react";
import type { TagDraft } from "@/types/article";

export function useTagManager(initialTags: TagDraft[] = []) {
  const [tags, setTags] = useState<TagDraft[]>(initialTags);
  const [pickerOpen, setPickerOpen] = useState(false);

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

  function openPicker() {
    setPickerOpen(true);
  }

  function closePicker() {
    setPickerOpen(false);
  }

  return {
    tags,
    setTags,
    pickerOpen,
    addTag,
    removeTag,
    openPicker,
    closePicker,
  };
}
