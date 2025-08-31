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
      <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
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

      {/* Botonera derecha */}
      <div className="ml-auto flex gap-2">
        {canEdit && (
          <>
            <Button asChild variant="secondary">
              <Link href={`/news/article?edit=${articleId}`}>
                Editar artículo
              </Link>
            </Button>
            <DeleteArticleButton id={articleId} />
          </>
        )}
        <Button asChild>
          <Link href="/news">Volver a noticias</Link>
        </Button>
      </div>
    </header>
  );
}
