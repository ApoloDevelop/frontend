import { useNewsPage, useNewsPermissions } from "@/hooks/news";
import {
  EmptyNewsState,
  NewsHeader,
  FeaturedNewsCard,
  NewsGrid,
  NewsPagination,
} from "@/components/news";
import { NewsSearch } from "@/components/news/NewsSearch";

type Search = { offset?: string; q?: string };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { offset, q } = await searchParams;
  const { canWrite } = await useNewsPermissions();
  const { getNewsData } = useNewsPage();

  const newsData = await getNewsData(offset, q);
  const { page, featured, rest, prevOffset, nextOffset } = newsData;

  if (!page.data.length) {
    return (
      <div className="container mx-auto px-4 overflow-x-clip">
        <div className="flex items-center justify-between mb-4">
          <NewsHeader canWrite={canWrite} showAddButton={false} />
          <NewsSearch />
        </div>
        <EmptyNewsState canWrite={canWrite} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 overflow-x-clip">
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start gap-3">
        <NewsHeader canWrite={canWrite} />
        <NewsSearch />
      </div>

      {featured && <FeaturedNewsCard article={featured} />}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <NewsGrid articles={rest} />
          <NewsPagination
            prevOffset={prevOffset}
            nextOffset={nextOffset}
            hasMore={page.hasMore}
          />
        </div>
      </div>
    </div>
  );
}
