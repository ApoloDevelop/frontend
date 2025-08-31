// app/news/page.tsx
import { useNewsPage, useNewsPermissions } from "@/hooks/news";
import {
  EmptyNewsState,
  NewsHeader,
  FeaturedNewsCard,
  NewsGrid,
  NewsPagination,
} from "@/components/news";

type Search = { offset?: string };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { offset } = await searchParams;
  const { canWrite } = await useNewsPermissions();
  const { getNewsData } = useNewsPage();

  const newsData = await getNewsData(offset);
  const { page, featured, rest, prevOffset, nextOffset } = newsData;

  if (!page.data.length) {
    return <EmptyNewsState canWrite={canWrite} />;
  }

  return (
    <div className="container mx-auto px-4 overflow-x-clip">
      <NewsHeader canWrite={canWrite} />

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
