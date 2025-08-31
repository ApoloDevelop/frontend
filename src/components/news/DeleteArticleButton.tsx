// src/components/news/DeleteArticleButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArticlesService } from "@/services/articles.service";
import { Trash2 } from "lucide-react";

export function DeleteArticleButton({
  id,
  redirectTo = "/news",
}: {
  id: number;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (loading) return;
    const ok = window.confirm(
      "¿Seguro que quieres borrar este artículo? Esta acción es permanente."
    );
    if (!ok) return;

    setLoading(true);
    try {
      await ArticlesService.remove(id); // DELETE /articles/:id (con token)
      router.replace(redirectTo);
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "No se pudo borrar el artículo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={onDelete}
      variant="destructive"
      disabled={loading}
      className="inline-flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Borrando…" : "Eliminar artículo"}
    </Button>
  );
}
