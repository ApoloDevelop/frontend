"use client";

import { useEffect, useState } from "react";
import { ActivityService } from "@/services/activity.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { ActivityPost } from "@/types/activity";
dayjs.extend(relativeTime);
dayjs.locale("es");

export function ActivityFeed({
  userId,
  refreshToken = 0,
  canDelete = false,
  onDeleted,
}: {
  userId: number;
  refreshToken?: number; // para forzar recarga
  canDelete?: boolean;
  onDeleted?: (id: number) => void;
}) {
  const TAKE = 10;
  const [items, setItems] = useState<ActivityPost[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const load = async (reset = false) => {
    if (loading) return;
    if (!reset && cursor == null) return;
    setLoading(true);
    try {
      const skip = reset ? 0 : cursor ?? 0;
      const page = await ActivityService.listByUser(userId, skip, TAKE);
      setItems(reset ? page.items : [...items, ...page.items]);
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshToken]);

  const remove = async (id: number) => {
    await ActivityService.remove(id);
    setItems((arr) => arr.filter((x) => x.id !== id));
    onDeleted?.(id);
  };

  return (
    <div className="mt-4 space-y-3">
      {items.map((p) => (
        <Card key={p.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Link
                href={`/users/${p.author.username}`}
                className="hover:underline"
              >
                {p.author.fullname || p.author.username}
              </Link>{" "}
              <span className="text-xs text-muted-foreground">
                — {dayjs(p.timestamp).fromNow()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="mb-2">
              <span className="uppercase text-[10px] text-muted-foreground mr-2">
                {p.itemType}
              </span>
              <span className="font-medium">{p.display.title}</span>
              {p.display.artistName && (
                <span className="text-muted-foreground">
                  {" "}
                  • {p.display.artistName}
                </span>
              )}
              {p.display.albumName && (
                <span className="text-muted-foreground">
                  {" "}
                  • {p.display.albumName}
                </span>
              )}
            </div>
            {p.content && <p className="whitespace-pre-wrap">{p.content}</p>}
            {canDelete && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(p.id)}
                >
                  Borrar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center pt-2">
        {cursor != null ? (
          <Button onClick={() => load(false)} disabled={loading}>
            {loading ? "Cargando…" : "Cargar más"}
          </Button>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay actividad.</p>
        ) : null}
      </div>
    </div>
  );
}
