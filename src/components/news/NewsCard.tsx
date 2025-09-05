import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { NewsArticle } from "@/types/news";

dayjs.locale("es");

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="min-w-0 group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition">
      <Link href={`/news/${article.id}`} className="block">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={article.image_url || "/default-cover.png"}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold leading-snug group-hover:underline line-clamp-2">
            {article.title}
          </h3>
          <div className="mt-2 text-sm text-gray-600 flex flex-wrap items-center gap-2">
            <time dateTime={article.published_date}>
              {dayjs(article.published_date).format("D MMM YYYY")}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
