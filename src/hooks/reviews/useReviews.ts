"use client";
import { useState, useEffect, useRef } from "react";
import { ReviewService } from "@/services/review.service";
import { ReviewCardData } from "@/types/reviews";

interface UseReviewsProps {
  open: boolean;
  itemId: number;
  verified: boolean;
  currentUserId?: number | null;
}

interface UseReviewsReturn {
  reviews: ReviewCardData[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewCardData[]>>;
  nextCursor: number | null;
  isLoading: boolean;
  loadPage: (cursor?: number) => Promise<void>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

const PAGE_SIZE = 10;

export function useReviews({
  open,
  itemId,
  verified,
  currentUserId,
}: UseReviewsProps): UseReviewsReturn {
  const [reviews, setReviews] = useState<ReviewCardData[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
        return merged;
      });
      setNextCursor(page.nextCursor);
    } catch (e) {
      console.error("Error al cargar reseñas:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial cuando cambian las dependencias
  useEffect(() => {
    if (!open) return;
    setReviews([]);
    setNextCursor(null);
    loadPage(undefined);
  }, [open, itemId, verified, currentUserId]);

  // Infinite scroll
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
  }, [nextCursor, isLoading]);

  return {
    reviews,
    setReviews,
    nextCursor,
    isLoading,
    loadPage,
    scrollRef,
    sentinelRef,
  };
}
