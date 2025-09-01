/* components/ReviewsModal.tsx */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "../ui/dialog";
import { ChartContainer, ChartTooltip, ChartLegend } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ThumbsUp, ThumbsDown, X as XIcon, Trash2 } from "lucide-react";
import { ReviewService } from "@/services/review.service";
import { ReviewCardData, SortMode } from "@/types/reviews";

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number;
  name: string;
  averageScore: number | null;
  verified: boolean;
  currentUserId?: number | null;
  canModerate?: boolean;
}

const PAGE_SIZE = 10;

export function ReviewsModal({
  open,
  onOpenChange,
  itemId,
  name,
  averageScore,
  verified,
  currentUserId,
  canModerate = false,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<ReviewCardData[]>([]);
  const [histogram, setHistogram] = useState<{ name: string; count: number }[]>(
    []
  );
  const [maxCount, setMaxCount] = useState<number>(1);

  // filtro por barra (1..10, redondeo igual que histograma)
  const [filterScore, setFilterScore] = useState<number | null>(null);
  const handleBarClick = (bucket: number) =>
    setFilterScore((prev) => (prev === bucket ? null : bucket));

  // ordenación
  const [sortMode, setSortMode] = useState<SortMode>("recent_desc");

  // paginación real (cursor)
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const recomputeHistogram = (list: ReviewCardData[]) => {
    const counts = Array.from({ length: 10 }, (_, i) => ({
      name: String(i + 1),
      count: 0,
    }));
    list.forEach((r) => {
      const idx = Math.min(Math.max(Math.round(r.score), 1), 10) - 1;
      counts[idx].count += 1;
    });
    setHistogram(counts);
    setMaxCount(Math.max(1, ...counts.map((c) => c.count)));
  };

  function mergeDedupe(prev: ReviewCardData[], next: ReviewCardData[]) {
    const map = new Map<number, ReviewCardData>();
    for (const r of prev) map.set(r.id, r);
    for (const r of next) map.set(r.id, r);
    return Array.from(map.values());
  }

  const loadPage = async (cursor?: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const page = await ReviewService.getReviewsByItem(
        itemId,
        verified,
        currentUserId ?? undefined,
        PAGE_SIZE,
        cursor
      );
      setReviews((prev) => {
        const merged = cursor ? [...prev, ...page.items] : page.items;
        recomputeHistogram(merged);
        return merged;
      });
      setNextCursor(page.nextCursor);
    } catch (e) {
      console.error("Error al cargar reseñas:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // carga inicial / cuando cambian dependencias
  useEffect(() => {
    if (!open) return;
    setReviews([]);
    setNextCursor(null);
    setFilterScore(null);
    loadPage(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, itemId, verified, currentUserId]);

  // infinite scroll: observar el sentinel DENTRO del contenedor con scroll
  useEffect(() => {
    const rootEl = scrollRef.current;
    const target = sentinelRef.current;
    if (!rootEl || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextCursor && !isLoading) {
          loadPage(nextCursor);
        }
      },
      { root: rootEl, rootMargin: "0px 0px 300px 0px", threshold: 0.1 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [nextCursor, isLoading]); // loadPage ya cierra sobre itemId/verified/currentUserId

  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  // orden
  const sortedBase = useMemo(() => {
    const base = [...reviews].sort((a, b) => {
      switch (sortMode) {
        case "up_desc":
          if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
          if (a.downvotes !== b.downvotes) return a.downvotes - b.downvotes;
          return +new Date(b.created_at) - +new Date(a.created_at);
        case "up_asc":
          if (a.upvotes !== b.upvotes) return a.upvotes - b.upvotes;
          if (b.downvotes !== a.downvotes) return b.downvotes - a.downvotes;
          return +new Date(b.created_at) - +new Date(a.created_at);
        case "recent_asc":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "recent_desc":
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return base;
  }, [reviews, sortMode]);

  const filteredBase =
    filterScore == null
      ? sortedBase
      : sortedBase.filter((r) => Math.round(r.score) === filterScore);

  const myReview = useMemo(
    () =>
      currentUserId
        ? filteredBase.find((r) => r.user?.id === currentUserId) ?? null
        : null,
    [filteredBase, currentUserId]
  );
  const otherReviews = useMemo(
    () =>
      filteredBase.filter(
        (r) => !currentUserId || r.user?.id !== currentUserId
      ),
    [filteredBase, currentUserId]
  );

  const handleVote = async (reviewId: number, value: 1 | -1) => {
    if (!currentUserId) return;
    const prev = reviews;

    // optimista
    setReviews((prevList) =>
      prevList.map((r) => {
        if (r.id !== reviewId) return r;
        let up = r.upvotes,
          down = r.downvotes,
          my = r.myVote;
        if (my === value) {
          if (value === 1) up--;
          else down--;
          my = 0;
        } else {
          if (my === 1) up--;
          if (my === -1) down--;
          if (value === 1) up++;
          else down++;
          my = value;
        }
        return {
          ...r,
          upvotes: Math.max(0, up),
          downvotes: Math.max(0, down),
          myVote: my as -1 | 0 | 1,
        };
      })
    );

    try {
      await ReviewService.voteReview(reviewId, value);
    } catch (e) {
      console.error("vote failed:", e);
      setReviews(prev); // revert
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!currentUserId && !canModerate) return;
    if (!confirm("¿Eliminar esta reseña?")) return;

    try {
      await ReviewService.deleteReview(reviewId);
      window.location.reload();
    } catch (e) {
      console.error("delete failed:", e);
      alert("No se pudo eliminar la reseña");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent
        className="
          w-[92vw] sm:w-[90vw] max-w-md sm:max-w-lg md:max-w-2xl
          p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl
          flex flex-col max-h-[85vh]
        "
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl">
            Reseñas {verified ? "verificadas" : "no verificadas"} de {name}:{" "}
            {averageScore ?? "-"}
          </DialogTitle>
        </DialogHeader>

        {/* Gráfico (clicable) */}
        <ChartContainer
          id="reviews-histogram"
          config={{ count: { label: "Puntuaciones" } }}
          className="mb-4 sm:mb-6 h-40 sm:h-56 md:h-64 w-full shrink-0"
        >
          <BarChart
            data={histogram}
            margin={{ top: 8, right: 12, bottom: 12, left: 12 }}
          >
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, maxCount]}
              ticks={yTicks}
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip />
            <ChartLegend />
            <Bar
              dataKey="count"
              name="Puntuaciones (pulsa para filtrar)"
              legendType="star"
              barSize={18}
            >
              {histogram.map((_, idx) => {
                const bucket = idx + 1;
                const active = filterScore === bucket;
                return (
                  <Cell
                    key={`cell-${idx}`}
                    cursor="pointer"
                    fill={active ? "#59168B" : "#C7A3DB"}
                    onClick={() => handleBarClick(bucket)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Filtros + Orden */}
        <div className="shrink-0 mb-2 flex items-center justify-between gap-2">
          <div>
            {filterScore != null && (
              <span className="inline-flex items-center gap-2 text-sm rounded-full border px-3 py-1">
                Filtrando por puntuación: <strong>{filterScore}</strong>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setFilterScore(null)}
                  aria-label="Quitar filtro"
                  title="Quitar filtro"
                >
                  <XIcon className="h-4 w-4 cursor-pointer hover:text-red-600" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="order" className="text-muted-foreground">
              Orden:
            </label>
            <select
              id="order"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-md border px-1 py-1.5 bg-white hover:bg-gray-50"
            >
              <option value="recent_desc">Más recientes primero</option>
              <option value="recent_asc">Más antiguas primero</option>
              <option value="up_desc">Mejor valoradas primero</option>
              <option value="up_asc">Peor valoradas primero</option>
            </select>
          </div>
        </div>

        {/* Lista con scroll + sentinel (paginación real) */}
        <div
          ref={scrollRef}
          className="grow overflow-y-auto space-y-3 sm:space-y-4 pr-1"
        >
          {/* --- MI RESEÑA --- */}
          {myReview && (
            <>
              <h4 className="text-sm font-semibold text-purple-800 mb-1">
                Tu reseña
              </h4>

              <Card key={`mine-${myReview.id}`}>
                <CardHeader className="flex justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      {myReview.user.profile_pic ? (
                        <AvatarImage
                          src={myReview.user.profile_pic}
                          alt={myReview.user.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {myReview.user.username.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <span className="truncate">
                          {myReview.title || "Sin título"}
                        </span>
                        <span className="shrink-0 font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {myReview.score}
                        </span>
                      </CardTitle>

                      {/* Eliminar debajo de la puntuación */}
                      <div className="mt-1">
                        <button
                          onClick={() => handleDelete(myReview.id)}
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
                          title="Eliminar reseña"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar reseña
                        </button>
                      </div>

                      <div className="mt-1 text-sm sm:text-[0.95rem] text-gray-700 italic">
                        {myReview.user.username}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {require("dayjs")(myReview.created_at)
                          .locale("es")
                          .format("DD MMM YYYY")}
                      </div>
                    </div>
                  </div>

                  {/* net score */}
                  <div
                    className={`text-sm sm:text-base font-semibold ${
                      myReview.upvotes - myReview.downvotes > 0
                        ? "text-green-600"
                        : myReview.upvotes - myReview.downvotes < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {(() => {
                      const net = myReview.upvotes - myReview.downvotes;
                      return net > 0 ? `+${net}` : `${net}`;
                    })()}
                  </div>
                </CardHeader>

                {myReview.text && (
                  <CardContent className="pt-0 sm:pt-2 text-sm sm:text-base">
                    {myReview.text}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => handleVote(myReview.id, 1)}
                        aria-pressed={myReview.myVote === 1}
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
                          myReview.myVote === 1
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "border-transparent hover:bg-green-50 text-green-600"
                        }`}
                        title="Estoy de acuerdo"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleVote(myReview.id, -1)}
                        aria-pressed={myReview.myVote === -1}
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
                          myReview.myVote === -1
                            ? "bg-red-50 border-red-500 text-red-700"
                            : "border-transparent hover:bg-red-50 text-red-600"
                        }`}
                        title="No estoy de acuerdo"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {otherReviews.length > 0 && (
                <h4 className="text-sm font-semibold text-gray-700 mt-4">
                  Otras reseñas
                </h4>
              )}
            </>
          )}

          {/* --- OTRAS --- */}
          {otherReviews.map((review) => {
            const net = review.upvotes - review.downvotes;
            const netClass =
              net > 0
                ? "text-green-600"
                : net < 0
                ? "text-red-600"
                : "text-muted-foreground";
            const canDelete = review.user?.id === currentUserId || canModerate;

            return (
              <Card key={review.id}>
                <CardHeader className="flex justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      {review.user.profile_pic ? (
                        <AvatarImage
                          src={review.user.profile_pic}
                          alt={review.user.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {review.user.username.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <span className="truncate">
                          {review.title || "Sin título"}
                        </span>
                        <span className="shrink-0 font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {review.score}
                        </span>
                      </CardTitle>

                      {/* Eliminar debajo de la puntuación (si procede) */}
                      {canDelete && (
                        <div className="mt-1">
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
                            title="Eliminar reseña"
                          >
                            <Trash2 className="h-4 w-4" /> Eliminar reseña
                          </button>
                        </div>
                      )}

                      <div className="mt-1 text-sm sm:text-[0.95rem] text-gray-700 italic">
                        {review.user.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {require("dayjs")(review.created_at)
                          .locale("es")
                          .format("DD MMM YYYY")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm sm:text-base font-semibold ${netClass}`}
                  >
                    {net > 0 ? `+${net}` : `${net}`}
                  </div>
                </CardHeader>

                {review.text && (
                  <CardContent className="pt-0 sm:pt-2 text-sm sm:text-base">
                    {review.text}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => handleVote(review.id, 1)}
                        aria-pressed={review.myVote === 1}
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
                          review.myVote === 1
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "border-transparent hover:bg-green-50 text-green-600"
                        }`}
                        title="Estoy de acuerdo"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleVote(review.id, -1)}
                        aria-pressed={review.myVote === -1}
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition ${
                          review.myVote === -1
                            ? "bg-red-50 border-red-500 text-red-700"
                            : "border-transparent hover:bg-red-50 text-red-600"
                        }`}
                        title="No estoy de acuerdo"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Sentinel */}
          <div ref={sentinelRef} />

          {/* Estado de carga */}
          {isLoading && (
            <div className="py-3 text-center text-sm text-muted-foreground">
              Cargando…
            </div>
          )}

          {/* Fin de lista */}
          {!isLoading && nextCursor === null && reviews.length > 0 && (
            <div className="py-3 text-center text-sm text-muted-foreground">
              No hay más reseñas
            </div>
          )}

          {reviews.length === 0 && !isLoading && (
            <div className="text-sm text-muted-foreground px-1 py-2">
              {filterScore == null
                ? "No hay reseñas todavía."
                : `No hay reseñas con puntuación ${filterScore}.`}
            </div>
          )}
        </div>

        <DialogClose className="mt-4 inline-flex justify-center w-full sm:w-auto px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-purple-900 shrink-0">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
