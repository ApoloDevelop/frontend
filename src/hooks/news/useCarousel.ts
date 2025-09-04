// src/hooks/news/useCarousel.ts
"use client";

import { useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  itemsLength: number;
  autoSlideInterval?: number;
}

export function useCarousel({
  itemsLength,
  autoSlideInterval = 8000,
}: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide cada X segundos (pausado al hacer hover)
  useEffect(() => {
    if (isHovered || itemsLength <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev === itemsLength - 1 ? 0 : prev + 1));
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isHovered, itemsLength, autoSlideInterval]);

  // Actualizar el scroll cuando cambie el índice
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, [index]);

  const slideTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, itemsLength - 1));
    setIndex(clamped);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? itemsLength - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === itemsLength - 1 ? 0 : prev + 1));
  };

  const setHovered = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  return {
    trackRef,
    index,
    isHovered,
    slideTo,
    prev,
    next,
    setHovered,
  };
}
