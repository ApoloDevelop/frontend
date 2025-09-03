"use client";

import { useEffect, useState } from "react";
import { ActivityService } from "@/services/activity.service";
import { SpotifyService } from "@/services/spotify.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { ActivityPost } from "@/types/activity";
import { toast } from "sonner";
import Image from "next/image";
dayjs.extend(relativeTime);
dayjs.locale("es");

// Componente para contenido expandible
function ExpandableContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Verificamos si el texto es lo suficientemente largo para necesitar truncamiento
  const words = content.split(" ");
  const shouldTruncate = words.length > 15 || content.length > 150;

  return (
    <div className="mb-3 p-3 bg-muted/30 rounded-lg border-l-4 border-primary/20">
      <p
        className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
          !isExpanded && shouldTruncate ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:text-primary/80 mt-2 font-medium transition-colors cursor-pointer hover:underline"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}

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
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});

  // Función para obtener el cover de un item
  const getCoverForItem = async (post: ActivityPost): Promise<string> => {
    try {
      const { itemType, display } = post;

      if (itemType === "artist") {
        const artist = await SpotifyService.fetchArtistByName(
          display.title || ""
        );
        return artist?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "album" && display.artistName) {
        const album = await SpotifyService.fetchAlbumByName(
          display.title || "",
          display.artistName
        );
        return album?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "track" && display.artistName) {
        const track = await SpotifyService.fetchSongByName(
          display.title || "",
          display.albumName,
          display.artistName
        );
        return track?.album?.images?.[0]?.url || "/default-cover.png";
      }

      return "/default-cover.png";
    } catch (error) {
      console.warn("Error loading cover for item:", error);
      return "/default-cover.png";
    }
  };

  // Cargar covers para los items
  const loadCovers = async (posts: ActivityPost[]) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      posts.map(async (post) => {
        if (!itemCovers[post.id]) {
          const cover = await getCoverForItem(post);
          newCovers[post.id] = cover;
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => ({ ...prev, ...newCovers }));
    }
  };

  const load = async (reset = false) => {
    if (loading) return;
    if (!reset && cursor == null) return;
    setLoading(true);
    try {
      const skip = reset ? 0 : cursor ?? 0;
      const page = await ActivityService.listByUser(userId, skip, TAKE);
      const newItems = reset ? page.items : [...items, ...page.items];
      setItems(newItems);
      setCursor(page.nextCursor);

      // Cargar covers para los nuevos items
      await loadCovers(page.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshToken]);

  const remove = async (id: number) => {
    // Mostrar confirmación
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres borrar esta publicación? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      await ActivityService.remove(id);
      setItems((arr) => arr.filter((x) => x.id !== id));
      onDeleted?.(id);
      toast.success("Publicación borrada exitosamente");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo borrar la publicación");
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((p) => (
          <Card key={p.id} className="overflow-hidden h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <Link
                  href={`/users/${p.author.username}`}
                  className="hover:underline"
                >
                  {p.author.username}
                </Link>{" "}
                <span className="text-xs text-muted-foreground block mt-1">
                  {dayjs(p.timestamp).fromNow()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-3 flex items-center gap-3">
                {/* Cover del item */}
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={itemCovers[p.id] || "/default-cover.png"}
                    alt={p.display.title || "Cover"}
                    fill
                    className="object-cover rounded-md"
                    sizes="64px"
                  />
                </div>

                {/* Información del item */}
                <div className="flex-1 min-w-0">
                  <span className="uppercase text-[10px] text-muted-foreground mr-2">
                    {p.itemType}
                  </span>
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                    {p.display.title}
                  </h4>
                  {p.display.artistName && (
                    <p className="text-muted-foreground text-xs line-clamp-1">
                      {p.display.artistName}
                    </p>
                  )}
                  {p.display.albumName && (
                    <p className="text-muted-foreground text-xs line-clamp-1">
                      {p.display.albumName}
                    </p>
                  )}
                </div>
              </div>
              {p.content && <ExpandableContent content={p.content} />}
              {canDelete && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(p.id)}
                    className="w-full"
                  >
                    Borrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
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
