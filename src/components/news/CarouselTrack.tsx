// src/components/news/CarouselTrack.tsx
import { RefObject } from "react";
import type { Article } from "@/types/article";
import { NewsSlide } from "./NewsSlide";

interface CarouselTrackProps {
  trackRef: RefObject<HTMLDivElement | null>;
  articles: Article[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CarouselTrack({
  trackRef,
  articles,
  onMouseEnter,
  onMouseLeave,
}: CarouselTrackProps) {
  return (
    <div
      ref={trackRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-xl"
      aria-roledescription="carousel"
      aria-label="Carrusel de noticias"
    >
      <div className="flex">
        {articles.map((article) => (
          <NewsSlide key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
