// src/hooks/news.ts
import { ArticlesService } from "@/services/articles.service";
import { NewsPageData } from "@/types/news";

const FIRST_PAGE_SIZE = 7;
const LATER_PAGE_SIZE = 9;

function normalizeOffset(off: number) {
  if (off <= 0) return 0;
  const delta = Math.max(0, off - FIRST_PAGE_SIZE);
  return (
    FIRST_PAGE_SIZE + Math.floor(delta / LATER_PAGE_SIZE) * LATER_PAGE_SIZE
  );
}

export function useNewsPage() {
  const getNewsData = async (
    offset?: string,
    q?: string
  ): Promise<NewsPageData> => {
    const hasQuery = !!(q && q.trim());
    const offRaw = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    const off = normalizeOffset(offRaw);

    // Con búsqueda, usamos layout “normal” (sin hero) y tamaño LATER_PAGE
    const limit = hasQuery
      ? LATER_PAGE_SIZE
      : off === 0
      ? FIRST_PAGE_SIZE
      : LATER_PAGE_SIZE;

    const page = await ArticlesService.list({
      offset: off,
      limit,
      q: hasQuery ? q!.trim() : undefined,
    });

    const hasHero = !hasQuery && off === 0;
    const [featured, ...restRaw] = page.data;
    const rest = hasHero ? restRaw : page.data;

    const prevOffset =
      off === 0 ? null : off <= FIRST_PAGE_SIZE ? 0 : off - LATER_PAGE_SIZE;
    const nextOffset =
      off === 0 ? off + FIRST_PAGE_SIZE : off + LATER_PAGE_SIZE;

    return {
      page,
      featured: hasHero ? featured : null,
      rest,
      hasHero,
      prevOffset,
      nextOffset,
      offset: off,
    };
  };

  return {
    getNewsData,
    FIRST_PAGE_SIZE,
    LATER_PAGE_SIZE,
  };
}
