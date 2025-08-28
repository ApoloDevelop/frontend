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
import { ReviewService } from "@/services/review.service";

interface Review {
  id: number;
  score: number;
  title?: string;
  text?: string;
  user: {
    id: number;
    username: string;
    profile_pic?: string;
  };
}

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number;
  name: string;
  averageScore: number | null;
  verified: boolean;
}

export function ReviewsModal({
  open,
  onOpenChange,
  itemId,
  name,
  averageScore,
  verified,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [histogram, setHistogram] = useState<{ name: string; count: number }[]>(
    []
  );
  const [maxCount, setMaxCount] = useState<number>(1);

  useEffect(() => {
    if (!open) return;

    ReviewService.getReviewsByItem(itemId, verified)
      .then((data: Review[]) => {
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

        const m = Math.max(0, ...counts.map((c) => c.count));
        setMaxCount(Math.max(1, m)); // evita dominio [0,0]
      })
      .catch((err) => console.error("Error al obtener las reseñas:", err));
  }, [open, itemId, verified]);

  // ticks enteros de 0..maxCount
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

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

        {/* SOLO esto hace scroll */}
        <div className="grow overflow-y-auto space-y-3 sm:space-y-4 pr-1">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex items-start sm:items-center gap-3 sm:gap-4">
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
                    <div className="mt-1 text-sm sm:text-[0.95rem] text-gray-700 font-medium truncate">
                      {review.title}
                    </div>
                  )}
                </div>
              </CardHeader>
              {review.text && (
                <CardContent className="pt-0 sm:pt-2 text-sm sm:text-base">
                  {review.text}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Botón fijo */}
        <DialogClose className="mt-4 inline-flex justify-center w-full sm:w-auto px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-purple-900 shrink-0">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
