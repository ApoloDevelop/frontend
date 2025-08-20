// app/news/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { notFound } from "next/navigation";
import { ArticlesService } from "@/services/articles.service";

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

      {/* Contenido + Sidebar */}
      <div className="grid grid-cols-12 gap-6 px-4 pb-16">
        <main className="col-span-12 lg:col-span-8 space-y-8">
          {/* Contenido */}
          <article className="prose max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-img:rounded-xl">
            {/* Si tu contenido llega con saltos de línea, esto lo respeta */}
            <p className="whitespace-pre-line text-lg text-gray-800">
              {article.content}
            </p>
          </article>

          {/* Tags (placeholder hasta exponerlos en la API) */}
          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-3">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              {/* TODO: mapear tags reales cuando el backend los exponga */}
              <span className="px-3 py-1 rounded-full bg-black/5 text-sm">
                Próximamente
              </span>
            </div>
          </section>

          {/* Comentarios (estructura lista + form de ejemplo no funcional) */}
          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-3">Comentarios</h2>
            <div className="rounded-xl border p-4 bg-white">
              <p className="text-gray-600">
                La sección de comentarios se conectará en cuanto expongamos los
                endpoints de <code>comment</code>.
              </p>
              <form className="mt-4 space-y-3">
                <textarea
                  className="w-full rounded-lg border p-3"
                  rows={4}
                  placeholder="Escribe un comentario…"
                  disabled
                />
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center rounded-lg bg-gray-300 px-4 py-2 cursor-not-allowed"
                >
                  Publicar (próximamente)
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-2xl border p-5 bg-white">
            <h3 className="text-lg font-semibold mb-2">Relacionado</h3>
            <p className="text-gray-600">
              Aquí podrás mostrar artículos relacionados por tag cuando estén
              disponibles.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
