// src/components/news/ArticleContentEditor.tsx
"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ArticleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  isEdit: boolean;
  quillModules: any;
  quillFormats: string[];
}

export function ArticleContentEditor({
  value,
  onChange,
  isEdit,
  quillModules,
  quillFormats,
}: ArticleContentEditorProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        {isEdit ? "Cuerpo del artículo" : "Cuerpo del artículo *"}
      </label>
      <div className="quill-root relative rounded-lg border overflow-visible">
        <ReactQuill
          className="quill"
          theme="snow"
          value={value}
          onChange={onChange}
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
  );
}
