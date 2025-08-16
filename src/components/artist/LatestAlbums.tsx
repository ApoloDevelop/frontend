"use client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { slugify } from "@/helpers/normalization";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface LatestAlbumsProps {
  albums: Array<{
    id: string;
    name: string;
    release_date: string;
    images: Array<{ url: string }>;
  }>;
  artistSlug: string;
}

export const LatestAlbums: React.FC<LatestAlbumsProps> = ({
  albums,
  artistSlug,
}) => {
  if (!albums.length) {
    return (
      <p className="text-gray-500">No hay álbumes recientes disponibles.</p>
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
      <h2 className="mb-4 text-3xl font-bold">Álbumes</h2>
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
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${artistSlug}/${slugify(album.name)}`}
              className="flex-shrink-0 w-40 group"
              scroll
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={album.images[0]?.url || "/default-cover.png"}
                  alt={album.name}
                  width={160}
                  height={160}
                  className="aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 w-full truncate font-medium text-center">
                {album.name}
              </p>
              <p className="w-full text-sm text-gray-500 text-center">
                {dayjs(album.release_date).format("DD/MM/YYYY")}
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
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};
