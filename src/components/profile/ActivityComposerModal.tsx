"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActivityService } from "@/services/activity.service";
import { toast } from "sonner";
import { TagPicker } from "@/components/news/TagPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Picked =
  | { type: "artist"; name: string }
  | { type: "album"; name: string; artistName?: string }
  | { type: "track"; name: string; artistName?: string; albumName?: string };

interface ActivityComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPosted?: (post: any) => void;
}

export function ActivityComposerModal({
  open,
  onOpenChange,
  onPosted,
}: ActivityComposerModalProps) {
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
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
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo publicar");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal is closed
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPicked(null);
      setContent("");
      setTagPickerOpen(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear nueva publicación</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {!picked ? (
              <Button
                variant="secondary"
                onClick={() => setTagPickerOpen(true)}
              >
                Añadir artista / álbum / canción
              </Button>
            ) : (
              <div className="flex items-center justify-between rounded-lg border p-3">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPicked(null)}
                >
                  Descartar
                </Button>
              </div>
            )}

            <Textarea
              placeholder="Cuenta algo sobre este item (opcional)…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              className="min-h-[120px]"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={publish} disabled={loading || !picked}>
                {loading ? "Publicando…" : "Publicar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TagPicker modal */}
      <TagPicker
        open={tagPickerOpen}
        onClose={() => setTagPickerOpen(false)}
        onAdd={(t: any) => {
          setPicked(t);
          setTagPickerOpen(false);
        }}
      />
    </>
  );
}
