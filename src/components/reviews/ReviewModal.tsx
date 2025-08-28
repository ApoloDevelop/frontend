/* components/ReviewsModal.tsx */

"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "../ui/dialog";
import { ChartContainer, ChartTooltip, ChartLegend } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ReviewService } from "@/services/review.service";

// ===== Tipos (ajusta si ya tienes tus DTOs) =====
type ReviewCardData = {
  id: number;
  score: number;
  title?: string | null;
  text?: string | null;
  upvotes: number;
  downvotes: number;
  myVote: -1 | 0 | 1;
  user: { id: number; username: string; profile_pic?: string | null };
};

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number;
  name: string;
  averageScore: number | null;
  verified: boolean;
  currentUserId?: number | null;
}

export function ReviewsModal({
  open,
  onOpenChange,
  itemId,
  name,
  averageScore,
  verified,
  currentUserId,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<ReviewCardData[]>([]);
  const [histogram, setHistogram] = useState<{ name: string; count: number }[]>(
    []
  );
  const [maxCount, setMaxCount] = useState<number>(1);

  useEffect(() => {
    if (!open) return;

    ReviewService.getReviewsByItem(itemId, verified, currentUserId ?? 1)
      .then((data: ReviewCardData[]) => {
        setReviews(data);

        const counts = Array.from({ length: 10 }, (_, i) => ({
          name: String(i + 1),
          count: 0,
        }));
        data.forEach((r) => {
          const idx = Math.min(Math.max(Math.round(r.score), 1), 10) - 1;
          counts[idx].count += 1;
        });
        setHistogram(counts);
        setMaxCount(Math.max(1, ...counts.map((c) => c.count)));
      })
      .catch((err) => console.error("Error al obtener las reseñas:", err));
  }, [open, itemId, verified]);

  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  const handleVote = async (reviewId: number, value: 1 | -1) => {
    if (!currentUserId) return; // opcional: exigir login
    const prev = reviews;

    // optimista
    setReviews((prev) =>
      prev.map((r) => {
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
      await ReviewService.voteReview(reviewId, value, currentUserId);
    } catch (e) {
      console.error("vote failed:", e);
      // revertir o re-sincronizar
      try {
        const fresh = await ReviewService.getReviewsByItem(
          itemId,
          verified,
          currentUserId
        );
        setReviews(fresh);
      } catch {
        setReviews(prev); // revert
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent
        className="
          w-[92vw] sm:w-[90vw] max-w-md sm:max-w-lg md:max-w-2xl
          p-4 sm:p-6 md:p-8
          rounded-xl sm:rounded-2xl
          flex flex-col
          max-h-[85vh]
        "
      >
        {/* Header fijo */}
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl">
            Reseñas {verified ? "verificadas" : "no verificadas"} de {name}:{" "}
            {averageScore ?? "-"}
          </DialogTitle>
        </DialogHeader>

        {/* Gráfico fijo */}
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
              name="Puntuaciones"
              legendType="star"
              fill="#59168B" // morado
              barSize={18}
            />
          </BarChart>
        </ChartContainer>

        {/* SOLO reseñas hacen scroll */}
        <div className="grow overflow-y-auto space-y-3 sm:space-y-4 pr-1">
          {reviews.map((review) => {
            const net = review.upvotes - review.downvotes;
            const netClass =
              net > 0
                ? "text-green-600"
                : net < 0
                ? "text-red-600"
                : "text-muted-foreground";

            return (
              <Card key={review.id}>
                {/* Cabecera: izquierda info usuario, derecha suma neta */}
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
                        <span className="truncate">{review.user.username}</span>
                        <span className="shrink-0 font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {review.score}
                        </span>
                      </CardTitle>
                      {review.title && (
                        <div className="mt-1 text-sm sm:text-[0.95rem] text-gray-800 italic">
                          {review.title}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suma neta con signo */}
                  <div
                    className={`text-sm sm:text-base font-semibold ${netClass}`}
                  >
                    {net > 0 ? `+${net}` : `${net}`}
                  </div>
                </CardHeader>

                {review.text && (
                  <CardContent className="pt-0 sm:pt-2 text-sm sm:text-base">
                    {review.text}

                    {/* Botones pulgar 👍 👎 */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => handleVote(review.id, 1)}
                        aria-pressed={review.myVote === 1}
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition
                          ${
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
                        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 transition
                          ${
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
        </div>

        {/* Botón fijo */}
        <DialogClose className="mt-4 inline-flex justify-center w-full sm:w-auto px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-purple-900 shrink-0">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
