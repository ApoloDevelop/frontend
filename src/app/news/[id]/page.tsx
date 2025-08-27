// app/news/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { notFound } from "next/navigation";
import { ArticlesService } from "@/services/articles.service";
import CommentsSection from "@/components/news/CommentsSection";
import { slugify } from "@/utils/normalization";

dayjs.locale("es");

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) return notFound();

  let article: Awaited<ReturnType<typeof ArticlesService.getById>>;
  try {
    article = await ArticlesService.getById(articleId);
  } catch {
    return notFound();
  }

  const related = await ArticlesService.getRelated(articleId, 3).catch(
    () => []
  );
  const cover = article.image_url || "/default-cover.png";

  return (
    <div className="container mx-auto">
      {/* HERO con blur sutil */}
      <div className="relative h-56 sm:h-72 md:h-80 w-full mb-6">
        <Image
          src={cover}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Cabecera */}
      <header className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8 px-4">
        <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
            <time dateTime={article.published_date}>
              {dayjs(article.published_date).format("D MMM YYYY")}
            </time>
            <span aria-hidden>•</span>
            <span>
              Por{" "}
              <span className="font-semibold">Autor #{article.author_id}</span>
            </span>
            {typeof article.views === "number" && (
              <>
                <span aria-hidden>•</span>
                <span>{article.views} visitas</span>
              </>
            )}
          </div>
        </div>

        <div className="ml-0 sm:ml-auto mt-3 sm:mt-2 flex flex-wrap items-center gap-2 pr-4">
          <Link
            href="/news"
            className="rounded-xl border px-4 py-2 hover:bg-black/5 transition"
          >
            Volver a noticias
          </Link>
        </div>
      </header>

      {/* Contenido  Sidebar */}
      <div className="grid grid-cols-12 gap-6 px-4 pb-16">
        <main className="col-span-12 lg:col-span-8 space-y-8">
          {/* Contenido */}
          <article className="prose max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-img:rounded-xl ql-view">
            {/* Si tu contenido llega con saltos de línea, esto lo respeta */}
            <div
              // Si ya saneas en el backend, puedes inyectar directamente:
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Tags */}
          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-3">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              {(article.tags ?? []).length === 0 && (
                <span className="px-3 py-1 rounded-full bg-black/5 text-sm">
                  Sin etiquetas
                </span>
              )}
              {(article.tags ?? []).map((t) => {
                const tone =
                  t.type === "artist"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : t.type === "album"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : t.type === "track"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-800 border-gray-200";

                const href =
                  t.type === "artist"
                    ? `/artists/${slugify(t.name)}`
                    : t.type === "album"
                    ? t.artistName
                      ? `/albums/${slugify(t.artistName)}/${slugify(t.name)}`
                      : `/news?tag=${t.id}` // fallback si faltara artistName (caso raro)
                    : t.type === "track"
                    ? t.artistName && t.albumName
                      ? `/songs/${slugify(t.artistName)}/${slugify(
                          t.albumName
                        )}/${slugify(t.name)}`
                      : `/news?tag=${t.id}` // fallback si faltaran datos
                    : `/news?tag=${t.id}`;
                return (
                  <Link
                    key={t.id}
                    href={href}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:opacity-90 ${tone}`}
                    title={`Ir a ${t.type}: ${t.name}`}
                  >
                    <span className="capitalize">{t.type}</span>
                    <span>·</span>
                    <span className="font-medium">{t.name}</span>
                    {t.type !== "artist" && t.artistName ? (
                      <span className="text-gray-600">({t.artistName})</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Comentarios (estructura lista  form de ejemplo no funcional) */}
          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-3">Comentarios</h2>
            <CommentsSection articleId={articleId} currentUserId={2} />
          </section>
        </main>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-2xl border p-5 bg-white">
            <h3 className="text-lg font-semibold mb-2">Relacionado</h3>
            {related.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No hay artículos relacionados.
              </p>
            ) : (
              <ul className="space-y-4">
                {related.map((r) => (
                  <li key={r.id} className="flex gap-3">
                    <Link href={`/news/${r.id}`} className="shrink-0">
                      <Image
                        src={r.image_url || "/default-cover.png"}
                        alt=""
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/news/${r.id}`}
                        className="font-medium hover:underline line-clamp-2"
                      >
                        {r.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {dayjs(r.published_date).format("D MMM YYYY")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
