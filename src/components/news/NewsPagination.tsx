import Link from "next/link";

interface NewsPaginationProps {
  prevOffset: number | null;
  nextOffset: number;
  hasMore: boolean;
}

export function NewsPagination({
  prevOffset,
  nextOffset,
  hasMore,
}: NewsPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      {prevOffset !== null && (
        <Link
          href={`/news?offset=${prevOffset}`}
          className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
        >
          ← Anteriores
        </Link>
      )}
      {hasMore && (
        <Link
          href={`/news?offset=${nextOffset}`}
          className="px-4 py-2 rounded-lg border hover:bg-black/5 transition"
        >
          Más noticias →
        </Link>
      )}
    </div>
  );
}
