"use client";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/normalization";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface RelatedArtistsProps {
  artists: Array<{
    id: string | null;
    name: string | null;
    avatar?: string | null;
  }>;
}

export const RelatedArtists: React.FC<RelatedArtistsProps> = ({ artists }) => {
  if (!artists.length) {
    return (
      <p className="text-gray-700">
        No se encontraron artistas similares por tags.
      </p>
    );
  }

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white/80 p-4 sm:p-6 rounded-lg shadow">
      <h2 className="mb-4 text-3xl font-bold">Artistas relacionados</h2>
      {artists.length ? (
        <div className="relative">
          {/* Botón izquierdo */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 cursor-pointer -translate-y-8 bg-white/80 p-2 rounded-full shadow-md z-10 transform transition-transform duration-200 hover:scale-110 hover:bg-white/90"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          {/* Carrusel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 scrollbar-hide"
          >
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${slugify(artist.name ?? "")}`}
                className="flex-shrink-0 w-40 group"
                scroll
              >
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={artist.avatar || "/default-avatar.png"}
                    alt={artist.name ?? ""}
                    width={160}
                    height={160}
                    className="aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 w-full truncate font-medium text-center">
                  {artist.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Botón derecho */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 cursor-pointer -translate-y-8 bg-white/80 p-2 rounded-full shadow-md z-10 transform transition-transform duration-200 hover:scale-110 hover:bg-white/90"
            aria-label="Scroll right"
          >
            <FaChevronRight className="cursor-pointer" />
          </button>
        </div>
      ) : (
        <p className="text-gray-700">
          No se encontraron artistas similares por tags.
        </p>
      )}
    </section>
  );
};
