"use client";

import { useEffect, useRef, useState } from "react";
import { CommentsService } from "@/services/comments.service";
import type { Comment } from "@/types/comment";
import CommentItem from "./CommentItem";

type Props = {
  articleId: number;
  currentUserId?: number | null;
};

export default function CommentsSection({ articleId, currentUserId }: Props) {
  const [list, setList] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await CommentsService.listByArticle(articleId, {
          limit: 10,
        });
        setList(res.data);
        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch (e: any) {
        setError(e?.message ?? "No se pudieron cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  const canPost = !!currentUserId;

  async function handlePost(parent_id?: number | null) {
    const content = parent_id
      ? (replyRef.current?.value ?? "").trim()
      : newContent.trim();
    if (!content || !currentUserId) return;

    try {
      const created = await CommentsService.create(
        articleId,
        content,
        currentUserId,
        parent_id ?? undefined
      );
      if (parent_id) {
        setList((prev) =>
          prev.map((p) =>
            p.id === parent_id
              ? { ...p, other_comment: [...(p.other_comment ?? []), created] }
              : p
          )
        );
        setReplyTo(null);
        if (replyRef.current) replyRef.current.value = "";
      } else {
        setList((prev) => [...prev, { ...created, other_comment: [] }]);
        setNewContent("");
      }
    } catch (e: any) {
      alert(e?.message ?? "Error publicando el comentario.");
    }
  }

  async function handleDelete(id: number) {
    if (!currentUserId) return;
    if (!confirm("¿Eliminar comentario?")) return;
    try {
      await CommentsService.remove(id, currentUserId);
      // Borra del estado (si es padre, también quitaremos su bloque)
      setList((prev) =>
        prev
          .map((p) => ({
            ...p,
            other_comment: (p.other_comment ?? []).filter((c) => c.id !== id),
          }))
          .filter((p) => p.id !== id)
      );
    } catch (e: any) {
      alert(e?.message ?? "Error eliminando el comentario.");
    }
  }

  async function loadMore() {
    if (!hasMore || !nextCursor) return;
    try {
      const res = await CommentsService.listByArticle(articleId, {
        limit: 10,
        cursor: nextCursor,
      });
      setList((prev) => [...prev, ...res.data]);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (e: any) {
      alert(e?.message ?? "Error cargando más comentarios.");
    }
  }

  if (loading)
    return (
      <div className="rounded-xl border p-4 bg-white text-sm text-gray-500">
        Cargando comentarios…
      </div>
    );
  if (error)
    return (
      <div className="rounded-xl border p-4 bg-white text-sm text-red-600">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Form principal */}
      <div className="rounded-xl border p-4 bg-white">
        <h3 className="font-semibold mb-2">Deja tu comentario</h3>
        {!canPost ? (
          <p className="text-gray-600 text-sm">Inicia sesión para comentar.</p>
        ) : (
          <>
            <textarea
              className="w-full rounded-lg border p-3"
              rows={4}
              placeholder="Escribe un comentario…"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              onClick={() => handlePost(null)}
              className="mt-2 inline-flex items-center rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50"
              disabled={!newContent.trim()}
            >
              Publicar
            </button>
          </>
        )}
      </div>

      {/* Lista */}
      <ul className="space-y-4">
        {list.map((c) => (
          <li key={c.id} className="rounded-xl border p-4 bg-white">
            <CommentItem
              c={c}
              currentUserId={currentUserId}
              onReply={() => setReplyTo(c.id)}
              onDelete={() => handleDelete(c.id)}
            />

            {/* Respuestas */}
            {!!c.other_comment?.length && (
              <ul className="mt-3 pl-4 border-l space-y-3">
                {c.other_comment!.map((r) => (
                  <li key={r.id} className="rounded-lg border p-3 bg-white/60">
                    <CommentItem
                      c={r}
                      currentUserId={currentUserId}
                      onDelete={() => handleDelete(r.id)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* Caja de respuesta */}
            {canPost && replyTo === c.id && (
              <div className="mt-3">
                <textarea
                  ref={replyRef}
                  className="w-full rounded-lg border p-3"
                  rows={3}
                  placeholder="Responder…"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handlePost(c.id)}
                    className="inline-flex items-center rounded-lg bg-black text-white px-3 py-1.5"
                  >
                    Responder
                  </button>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="inline-flex items-center rounded-lg border px-3 py-1.5"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="text-center">
          <button onClick={loadMore} className="rounded-lg border px-4 py-2">
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}
