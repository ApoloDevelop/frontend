// src/components/news/NewsCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  articles: Article[];
  title?: string;
};

export function NewsCarousel({ articles, title = "Últimas noticias" }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // Actualiza el índice al hacer scroll (snap)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / (w || 1));
      setIndex(i);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const slideTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, articles.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const prev = () => slideTo(index - 1);
  const next = () => slideTo(index + 1);

  if (!articles?.length) return null;

  return (
    <section className="relative w-full my-12">
      <div className="mb-4 flex items-center justify-between px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>

        {/* Flechas (ocultas si 1 solo item) */}
        {articles.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="rounded-full border px-3 py-2 hover:bg-black/5 disabled:opacity-40"
              disabled={index === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="rounded-full border px-3 py-2 hover:bg-black/5 disabled:opacity-40"
              disabled={index === articles.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Pista del carrusel */}
      <div
        ref={trackRef}
        className="relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                className="group block relative h-[360px] sm:h-[420px] md:h-[480px]"
              >
                <div className="absolute inset-0">
                  <Image
                    src={a.image_url || "/default-cover.png"}
                    alt={a.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight line-clamp-2 group-hover:underline">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-white/80 text-sm">
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
          className="mt-4 flex justify-center gap-2"
          aria-label="Indicadores de página"
        >
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => slideTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 w-2 rounded-full transition
                ${
                  i === index ? "bg-black w-6" : "bg-black/30 hover:bg-black/50"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
