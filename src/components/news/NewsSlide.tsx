// src/components/news/NewsSlide.tsx
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";

interface NewsSlideProps {
  article: Article;
}

export function NewsSlide({ article }: NewsSlideProps) {
  return (
    <div
      className="relative flex-none w-full snap-center"
      aria-roledescription="slide"
    >
      <Link
        href={`/news/${article.id}`}
        className="group block relative h-[360px] sm:h-[420px] md:h-[480px] rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={article.image_url || "/default-cover.png"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="100vw"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-white/20 transition-opacity group-hover:opacity-95" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h3 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight line-clamp-2 group-hover:underline transition-all duration-200">
            {article.title}
          </h3>
          <p className="mt-2 text-white/90 text-sm font-medium">
            {new Date(article.published_date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </Link>
    </div>
  );
}
