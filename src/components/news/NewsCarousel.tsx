// src/components/news/NewsCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  articles: Article[];
};

export function NewsCarousel({ articles }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide cada 5 segundos (pausado al hacer hover)
  useEffect(() => {
    if (isHovered || articles.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovered, articles.length]);

  // Actualizar el scroll cuando cambie el índice
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, [index]);

  const slideTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, articles.length - 1));
    setIndex(clamped);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  if (!articles?.length) return null;

  return (
    <section className="relative w-full">
      <div className="mb-6 flex items-center justify-between px-2 sm:px-0">
        {/* Flechas (ocultas si 1 solo item) */}
        {articles.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="rounded-full border border-purple-200 bg-white hover:bg-purple-50 px-3 py-2 transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm hover:shadow-md dark:border-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/20"
              disabled={index === 0}
            >
              <ChevronLeft className="h-5 w-5 text-black dark:text-purple-300" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="rounded-full border border-purple-200 bg-white hover:bg-purple-50 px-3 py-2 transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm hover:shadow-md dark:border-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/20"
              disabled={index === articles.length - 1}
            >
              <ChevronRight className="h-5 w-5 text-black dark:text-purple-300" />
            </button>
          </div>
        )}
      </div>

      {/* Pista del carrusel */}
      <div
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-xl"
        aria-roledescription="carousel"
        aria-label="Carrusel de noticias"
      >
        <div className="flex">
          {articles.map((a) => (
            <div
              key={a.id}
              className="relative flex-none w-full snap-center"
              aria-roledescription="slide"
            >
              <Link
                href={`/news/${a.id}`}
                className="group block relative h-[360px] sm:h-[420px] md:h-[480px] rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0">
                  <Image
                    src={a.image_url || "/default-cover.png"}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="100vw"
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-white/20 transition-opacity group-hover:opacity-95" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight line-clamp-2 group-hover:underline transition-all duration-200">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-white/90 text-sm font-medium">
                    {new Date(a.published_date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {articles.length > 1 && (
        <div
          className="mt-6 flex justify-center gap-2"
          aria-label="Indicadores de página"
        >
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => slideTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer
                ${
                  i === index
                    ? "bg-black w-6 shadow-sm"
                    : "bg-black/30 hover:bg-black/40 w-2"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
