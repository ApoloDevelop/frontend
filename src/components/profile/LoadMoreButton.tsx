"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  hasMore: boolean;
  loading: boolean;
  itemsCount: number;
  onLoadMore: () => void;
}

export function LoadMoreButton({
  hasMore,
  loading,
  itemsCount,
  onLoadMore,
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center pt-6">
      {hasMore ? (
        <Button onClick={onLoadMore} disabled={loading}>
          {loading ? "Cargando…" : "Cargar más"}
        </Button>
      ) : itemsCount === 0 ? (
        <p className="text-sm text-muted-foreground">No hay actividad.</p>
      ) : null}
    </div>
  );
}
