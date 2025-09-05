"use client";

import type { Article } from "@/types/article";
import { useCarousel } from "@/hooks/news/useCarousel";
import { CarouselNavigation } from "./CarouselNavigation";
import { CarouselTrack } from "./CarouselTrack";
import { CarouselIndicators } from "./CarouselIndicators";

type Props = {
  articles: Article[];
};

export function NewsCarousel({ articles }: Props) {
  const { trackRef, index, slideTo, prev, next, setHovered } = useCarousel({
    itemsLength: articles.length,
    autoSlideInterval: 8000,
  });

  if (!articles?.length) return null;

  return (
    <section className="relative w-full">
      <CarouselNavigation
        itemsLength={articles.length}
        currentIndex={index}
        onPrev={prev}
        onNext={next}
      />

      <CarouselTrack
        trackRef={trackRef}
        articles={articles}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      <CarouselIndicators
        itemsLength={articles.length}
        currentIndex={index}
        onSlideTo={slideTo}
      />
    </section>
  );
}
