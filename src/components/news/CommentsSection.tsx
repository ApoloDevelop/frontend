"use client";

import { useEffect, useRef, useState } from "react";
import { CommentsService } from "@/services/comments.service";
import type { Comment } from "@/types/comment";
import type { AuthUser } from "@/types/auth";
import CommentItem from "./CommentItem";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  articleId: number;
  currentUser?: AuthUser | null;
};

export default function CommentsSection({ articleId, currentUser }: Props) {
  const router = useRouter();
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
        // Ordenar comentarios principales por fecha (más reciente primero)
        const sortedData = res.data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setList(sortedData);
        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch (e: any) {
        setError(e?.message ?? "No se pudieron cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  const canPost = !!currentUser;
  const currentUserId = currentUser?.id || null;

  // Helper function to check if user can delete a comment
  const canDeleteComment = (commentUserId: number) => {
    if (!currentUser) return false;
    // User can delete if they own the comment OR if they have role 1 or 2
    return (
      currentUser.id === commentUserId || [1, 2].includes(currentUser.role_id)
    );
  };

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
        // Insertar el nuevo comentario al principio de la lista (más reciente primero)
        setList((prev) => [{ ...created, other_comment: [] }, ...prev]);
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
      // Ordenar los nuevos comentarios por fecha (más reciente primero)
      const sortedNewData = res.data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setList((prev) => [...prev, ...sortedNewData]);
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
        <textarea
          className="w-full rounded-lg border p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={4}
          placeholder={
            canPost ? "Escribe un comentario…" : "Inicia sesión para comentar"
          }
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={!canPost}
        />
        <div className="mt-2 flex items-center justify-between">
          <Button
            onClick={() => handlePost(null)}
            className="inline-flex items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canPost || !newContent.trim()}
          >
            Publicar
          </Button>
          {!canPost && (
            <p className="text-gray-600 text-sm">
              <span
                className="text-purple-600 hover:text-purple-800 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Inicia sesión
              </span>{" "}
              para poder comentar.
            </p>
          )}
        </div>
      </div>

      {/* Lista */}
      <ul className="space-y-4">
        {list.map((c) => (
          <li key={c.id} className="rounded-xl border p-4 bg-white">
            <CommentItem
              c={c}
              currentUserId={currentUserId}
              onReply={canPost ? () => setReplyTo(c.id) : undefined}
              onDelete={
                canDeleteComment(c.user_id)
                  ? () => handleDelete(c.id)
                  : undefined
              }
            />

            {/* Respuestas */}
            {!!c.other_comment?.length && (
              <ul className="mt-3 pl-4 border-l space-y-3">
                {c.other_comment!.map((r) => (
                  <li key={r.id} className="rounded-lg border p-3 bg-white/60">
                    <CommentItem
                      c={r}
                      currentUserId={currentUserId}
                      onDelete={
                        canDeleteComment(r.user_id)
                          ? () => handleDelete(r.id)
                          : undefined
                      }
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
                  <Button
                    onClick={() => handlePost(c.id)}
                    className="inline-flex items-center rounded-lg bg-black text-white px-3 py-1.5 cursor-pointer"
                  >
                    Responder
                  </Button>
                  <Button
                    onClick={() => setReplyTo(null)}
                    className="inline-flex items-center rounded-lg border px-3 py-1.5 hover:bg-red-800"
                    variant={"destructive"}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="text-center">
          <Button onClick={loadMore}>Ver más comentarios</Button>
        </div>
      )}
    </div>
  );
}
