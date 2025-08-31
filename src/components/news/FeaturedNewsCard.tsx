import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { NewsArticle } from "@/types/news";

dayjs.locale("es");

interface FeaturedNewsCardProps {
  article: NewsArticle;
}

export function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  return (
    <section className="relative mb-8 rounded-2xl overflow-hidden">
      <Link
        href={`/news/${article.id}`}
        className="group block relative h-[360px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
      >
        <div className="relative h-[360px] sm:h-[420px] md:h-[480px] cursor-pointer">
          <Image
            src={article.image_url || "/default-cover.png"}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-3xl">
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight group-hover:underline">
                {article.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-white/80">
                <time dateTime={article.published_date}>
                  {dayjs(article.published_date).format("D MMM YYYY")}
                </time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
