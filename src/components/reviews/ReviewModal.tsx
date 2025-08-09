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

  useEffect(() => {
    if (!open) return;

    // Usar el servicio para obtener las reseñas
    ReviewService.getReviewsByItem(itemId, verified)
      .then((data: Review[]) => {
        setReviews(data);

        // Crear el histograma
        const counts = Array.from({ length: 10 }, (_, i) => ({
          name: String(i + 1),
          count: 0,
        }));
        data.forEach((r) => {
          const idx = Math.min(Math.max(Math.round(r.score), 1), 10) - 1;
          counts[idx].count += 1;
        });
        setHistogram(counts);
      })
      .catch((err) => {
        console.error("Error al obtener las reseñas:", err);
      });
  }, [open, itemId, verified]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Reseñas {verified ? "verificadas" : "no verificadas"} de {name}:{" "}
            {averageScore ?? "-"}
          </DialogTitle>
        </DialogHeader>

        <ChartContainer
          id="reviews-histogram"
          config={{ count: { label: "Nº valoraciones" } }}
          className="mb-6 h-64"
        >
          <BarChart data={histogram}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <ChartLegend />
            <Bar dataKey="count" />
          </BarChart>
        </ChartContainer>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex items-center gap-4">
                <Avatar>
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
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>{review.user.username}</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {review.score}
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              {review.text && <CardContent>{review.text}</CardContent>}
            </Card>
          ))}
        </div>

        <DialogClose className="mt-4 inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
