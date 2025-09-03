// src/components/news/TagPickerModal.tsx
"use client";

import { ReactNode } from "react";

interface TagPickerModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function TagPickerModal({
  open,
  onClose,
  children,
}: TagPickerModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* modal */}
      <div className="relative z-[201] w-[min(92vw,900px)] max-h-[85vh] rounded-2xl bg-white shadow-2xl border overflow-hidden">
        {children}
      </div>
    </div>
  );
}
