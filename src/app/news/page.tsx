// app/news/page.tsx
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ArticlesService } from "@/services/articles.service";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

dayjs.locale("es");

type Search = { offset?: string };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { offset } = await searchParams;
  const user = await getCurrentUser();

  const off = Number.isFinite(Number(offset)) ? Number(offset) : 0;
  const page = await ArticlesService.list({ offset: off, limit: 13 });

  if (!page.data.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-2">Noticias</h1>
        <p className="text-gray-600">Aún no hay artículos publicados.</p>
        {user?.role_id === 3 && (
          <div className="mt-6">
            <Button>
              <Link href="/news/article">Añadir artículo</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  const [featured, ...rest] = page.data;

  return (
    <div className="container mx-auto px-4">
      {/* Cabecera + CTA writer */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-3xl font-bold">Noticias</h1>
        {user?.role_id === 3 && (
          <Button>
            <Link href="/news/article">Añadir artículo</Link>
          </Button>
        )}
      </div>

      {/* DESTACADO */}
      <section className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="relative h-[360px] sm:h-[420px] md:h-[480px] cursor-pointer">
          <Image
            src={featured.image_url || "/default-cover.png"}
            alt={featured.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-3xl">
              <Link href={`/news/${featured.id}`} className="group block">
                <h2 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight group-hover:underline">
                  {featured.title}
                </h2>
              </Link>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-white/80">
                <time dateTime={featured.published_date}>
                  {dayjs(featured.published_date).format("D MMM YYYY")}
                </time>
                <span aria-hidden>•</span>
                <span>Autor #{featured.author_id}</span>
                {typeof featured.views === "number" && (
                  <>
                    <span aria-hidden>•</span>
                    <span>{featured.views} visitas</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID + PAGINACIÓN (igual que tenías antes) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((a) => (
              <article
                key={a.id}
                className="group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition"
              >
                <Link href={`/news/${a.id}`} className="block">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={a.image_url || "/default-cover.png"}
                      alt={a.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold leading-snug group-hover:underline line-clamp-2">
                      {a.title}
                    </h3>
                    <div className="mt-2 text-sm text-gray-600 flex flex-wrap items-center gap-2">
                      <time dateTime={a.published_date}>
                        {dayjs(a.published_date).format("D MMM YYYY")}
                      </time>
                      <span aria-hidden>•</span>
                      <span>Autor #{a.author_id}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 my-8">
            {off > 0 && (
              <Link
                href={`/news?offset=${Math.max(0, off - 13)}`}
                className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
              >
                ← Anteriores
              </Link>
            )}
            {page.hasMore && (
              <Link
                href={`/news?offset=${off + 13}`}
                className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
              >
                Más noticias →
              </Link>
            )}
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Otros widgets… */}
        </aside>
      </div>
    </div>
  );
}
