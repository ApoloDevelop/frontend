"use client";
import { useState, useCallback } from "react";
import { ReviewCardData } from "@/types/reviews";

interface UseHistogramReturn {
  histogram: { name: string; count: number }[];
  maxCount: number;
  filterScore: number | null;
  setFilterScore: (score: number | null) => void;
  handleBarClick: (bucket: number) => void;
  recomputeHistogram: (reviews: ReviewCardData[]) => void;
}

export function useHistogram(): UseHistogramReturn {
  const [histogram, setHistogram] = useState<{ name: string; count: number }[]>(
    []
  );
  const [maxCount, setMaxCount] = useState<number>(1);
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const recomputeHistogram = useCallback((list: ReviewCardData[]) => {
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
  }, []);

  const handleBarClick = useCallback((bucket: number) => {
    setFilterScore((prev) => (prev === bucket ? null : bucket));
  }, []);

  return {
    histogram,
    maxCount,
    filterScore,
    setFilterScore,
    handleBarClick,
    recomputeHistogram,
  };
}
