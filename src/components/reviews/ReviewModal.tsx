"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "../ui/dialog";
import { useReviews } from "@/hooks/reviews/useReviews";
import { useHistogram } from "@/hooks/reviews/useHistogram";
import { useReviewFilters } from "@/hooks/reviews/useReviewFilters";
import { useReviewActions } from "@/hooks/reviews/useReviewActions";
import { ReviewHistogram } from "./ReviewHistogram";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewList } from "./ReviewList";

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
  const { reviews, setReviews, nextCursor, isLoading, scrollRef, sentinelRef } =
    useReviews({
      open,
      itemId,
      verified,
      currentUserId,
    });

  const {
    histogram,
    maxCount,
    filterScore,
    setFilterScore,
    handleBarClick,
    recomputeHistogram,
  } = useHistogram();

  const { sortMode, setSortMode, myReview, otherReviews } = useReviewFilters({
    reviews,
    filterScore,
    currentUserId,
  });

  const { handleVote, handleDelete } = useReviewActions({
    reviews,
    setReviews,
    currentUserId,
    canModerate,
  });

  // Recalcular histograma cuando cambian las reseñas o el filtro
  useEffect(() => {
    recomputeHistogram(reviews);
  }, [reviews, recomputeHistogram]);

  // Resetear filtro cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFilterScore(null);
    }
  }, [open, setFilterScore]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent
        className="
          w-[92vw] sm:w-[90vw] max-w-md sm:max-w-lg md:max-w-2xl
          p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl
          flex flex-col max-h-[95vh] min-h-[300px]
        "
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl">
            Reseñas {verified ? "verificadas" : "no verificadas"} de {name}:{" "}
            {averageScore ?? "-"}
          </DialogTitle>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6"
        >
          <ReviewHistogram
            histogram={histogram}
            maxCount={maxCount}
            filterScore={filterScore}
            onBarClick={handleBarClick}
          />

          <ReviewFilters
            filterScore={filterScore}
            sortMode={sortMode}
            onFilterClear={() => setFilterScore(null)}
            onSortChange={setSortMode}
          />

          <ReviewList
            myReview={myReview}
            otherReviews={otherReviews}
            currentUserId={currentUserId}
            canModerate={canModerate}
            onVote={handleVote}
            onDelete={handleDelete}
            isLoading={isLoading}
            nextCursor={nextCursor}
            totalReviews={reviews.length}
            filterScore={filterScore}
            sentinelRef={sentinelRef}
            verified={verified}
          />
        </div>

        <DialogClose className="mt-4 inline-flex justify-center w-full sm:w-auto px-4 py-2 cursor-pointer bg-black text-white rounded-md hover:bg-purple-900 shrink-0">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
