import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface RelatedArticle {
  id: number;
  title: string;
  image_url?: string | null;
  published_date: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <div className="rounded-2xl border p-5 bg-white">
      <h3 className="text-lg font-semibold mb-2">Relacionado</h3>
      {articles.length === 0 ? (
        <p className="text-gray-600 text-sm">No hay artículos relacionados.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="flex gap-3">
              <Link href={`/news/${article.id}`} className="shrink-0">
                <Image
                  src={article.image_url || "/default-cover.png"}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/news/${article.id}`}
                  className="font-medium hover:underline line-clamp-2"
                >
                  {article.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {dayjs(article.published_date).format("D MMM YYYY")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
