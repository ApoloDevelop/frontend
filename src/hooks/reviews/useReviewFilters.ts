"use client";
import { useState, useMemo } from "react";
import { ReviewCardData, SortMode } from "@/types/reviews";

interface UseReviewFiltersProps {
  reviews: ReviewCardData[];
  filterScore: number | null;
  currentUserId?: number | null;
}

interface UseReviewFiltersReturn {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  myReview: ReviewCardData | null;
  otherReviews: ReviewCardData[];
  filteredBase: ReviewCardData[];
}

export function useReviewFilters({
  reviews,
  filterScore,
  currentUserId,
}: UseReviewFiltersProps): UseReviewFiltersReturn {
  const [sortMode, setSortMode] = useState<SortMode>("recent_desc");

  // Ordenación
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

  // Filtrado por puntuación
  const filteredBase =
    filterScore == null
      ? sortedBase
      : sortedBase.filter((r) => Math.round(r.score) === filterScore);

  // Separar mi reseña de las otras
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

  return {
    sortMode,
    setSortMode,
    myReview,
    otherReviews,
    filteredBase,
  };
}
