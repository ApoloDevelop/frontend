"use client";

import { useState } from "react";
import { CloudinaryService } from "@/services/cloudinary.service";

export function useQuillEditor() {
  const [error, setError] = useState<string | null>(null);

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

  return {
    error,
    setError,
    quillModules,
    quillFormats,
  };
}
