// src/components/news/ArticleTitleInput.tsx
"use client";

interface ArticleTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  isEdit: boolean;
}

export function ArticleTitleInput({
  value,
  onChange,
  isEdit,
}: ArticleTitleInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="title" className="block text-sm font-medium">
        {isEdit ? "Título" : "Título *"}
      </label>
      <input
        id="title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Escribe un titular potente…"
        required
      />
    </div>
  );
}
