import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Button } from "@/components/ui/button";
import { DeleteArticleButton } from "./DeleteArticleButton";

dayjs.locale("es");

interface ArticleHeaderProps {
  title: string;
  publishedDate: string;
  author: {
    username: string;
    fullname: string;
  };
  articleId: number;
  canEdit: boolean;
}

export function ArticleHeader({
  title,
  publishedDate,
  author,
  articleId,
  canEdit,
}: ArticleHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8 px-4">
      <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1 order-2 sm:order-1">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
          <time dateTime={publishedDate} className="italic">
            {dayjs(publishedDate).format("D MMM YYYY")}
          </time>
          <span aria-hidden>•</span>
          <span>
            Por{" "}
            <Link
              href={`/users/${encodeURIComponent(author.username)}`}
              className="font-semibold hover:underline"
            >
              {author.fullname}
            </Link>
          </span>
        </div>
      </div>

      {/* Botonera: izquierda en móvil, derecha en desktop */}
      <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2 sm:ml-auto">
        {canEdit && (
          <div className="flex flex-col sm:flex-row gap-2 order-2 sm:order-none">
            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto h-9"
            >
              <Link href={`/news/article?edit=${articleId}`}>
                Editar artículo
              </Link>
            </Button>
            <DeleteArticleButton id={articleId} />
          </div>
        )}
        <Button asChild className="w-full sm:w-auto order-1 sm:order-none">
          <Link href="/news">Volver a noticias</Link>
        </Button>
      </div>
    </header>
  );
}
