"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActivityService } from "@/services/activity.service";
import { toast } from "sonner";
import { TagPicker } from "@/components/news/TagPicker";

type Picked =
  | { type: "artist"; name: string }
  | { type: "album"; name: string; artistName?: string }
  | { type: "track"; name: string; artistName?: string; albumName?: string };

export function ActivityComposer({
  onPosted,
}: {
  onPosted?: (post: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const publish = async () => {
    if (!picked) {
      toast.error("Selecciona un artista, álbum o canción");
      return;
    }
    setLoading(true);
    try {
      const post = await ActivityService.create({
        itemType: picked.type,
        name: picked.name,
        artistName: "artistName" in picked ? picked.artistName : undefined,
        albumName: "albumName" in picked ? picked.albumName : undefined,
        content: content.trim() || undefined,
      });
      toast.success("Publicado");
      setPicked(null);
      setContent("");
      onPosted?.(post);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        {!picked ? (
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Añadir artista / álbum / canción
          </Button>
        ) : (
          <div className="flex items-center justify-between rounded-lg border p-2">
            <div className="text-sm">
              <span className="uppercase text-xs text-muted-foreground mr-2">
                {picked.type}
              </span>
              <span className="font-medium">{picked.name}</span>
              {"artistName" in picked && picked.artistName ? (
                <span className="text-muted-foreground">
                  {" "}
                  • {picked.artistName}
                </span>
              ) : null}
              {"albumName" in picked && picked.albumName ? (
                <span className="text-muted-foreground">
                  {" "}
                  • {picked.albumName}
                </span>
              ) : null}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPicked(null)}>
              Cambiar
            </Button>
          </div>
        )}

        <Textarea
          placeholder="Cuenta algo sobre este item (opcional)…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
        />

        <div className="flex justify-end">
          <Button onClick={publish} disabled={loading || !picked}>
            {loading ? "Publicando…" : "Publicar"}
          </Button>
        </div>
      </div>

      {/* Reutilizamos tu TagPicker */}
      <TagPicker
        open={open}
        onClose={() => setOpen(false)}
        onAdd={(t: any) => {
          setPicked(t);
          setOpen(false);
        }}
      />
    </div>
  );
}
