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
const FIRST_PAGE_SIZE = 7;
const LATER_PAGE_SIZE = 9;

function normalizeOffset(off: number) {
  if (off <= 0) return 0;
  const delta = Math.max(0, off - FIRST_PAGE_SIZE);
  return (
    FIRST_PAGE_SIZE + Math.floor(delta / LATER_PAGE_SIZE) * LATER_PAGE_SIZE
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { offset } = await searchParams;
  const user = await getCurrentUser();

  const offRaw = Number.isFinite(Number(offset)) ? Number(offset) : 0;
  const off = normalizeOffset(offRaw);

  const limit = off === 0 ? FIRST_PAGE_SIZE : LATER_PAGE_SIZE;
  const page = await ArticlesService.list({ offset: off, limit });

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

  const hasHero = off === 0;
  const [featured, ...restRaw] = page.data;
  const rest = hasHero ? restRaw : page.data; // en páginas > 0 no hay destacado

  const prevOffset =
    off === 0 ? null : off <= FIRST_PAGE_SIZE ? 0 : off - LATER_PAGE_SIZE;
  const nextOffset = off === 0 ? off + FIRST_PAGE_SIZE : off + LATER_PAGE_SIZE;

  return (
    <div className="container mx-auto px-4 overflow-x-clip">
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
      {hasHero && featured && (
        <section className="relative mb-8 rounded-2xl overflow-hidden">
          <Link
            href={`/news/${featured.id}`}
            className="group block relative h-[360px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
          >
            <div className="relative h-[360px] sm:h-[420px] md:h-[480px] cursor-pointer">
              <Image
                src={featured.image_url || "/default-cover.png"}
                alt={featured.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="max-w-3xl">
                  <h2 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight group-hover:underline">
                    {featured.title}
                  </h2>
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
          </Link>
        </section>
      )}

      {/* GRID + PAGINACIÓN (igual que tenías antes) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="grid gap-6 grid-cols-1 sm:[grid-template-columns:repeat(2,minmax(0,1fr))] xl:[grid-template-columns:repeat(3,minmax(0,1fr))] 2xl:[grid-template-columns:repeat(3,minmax(0,1fr))]">
            {rest.map((a) => (
              <article
                key={a.id}
                className="min-w-0 group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition"
              >
                <Link href={`/news/${a.id}`} className="block">
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={a.image_url || "/default-cover.png"}
                      alt={a.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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

          {/* PAGINACIÓN con tamaños variables */}
          <div className="flex items-center justify-center gap-3 my-8">
            {prevOffset !== null && (
              <Link
                href={`/news?offset=${prevOffset}`}
                className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
              >
                ← Anteriores
              </Link>
            )}
            {page.hasMore && (
              <Link
                href={`/news?offset=${nextOffset}`}
                className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
              >
                Más noticias →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
