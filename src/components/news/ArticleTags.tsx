import Link from "next/link";
import { slugify } from "@/utils/normalization";

interface ArticleTag {
  id: number;
  type: "artist" | "album" | "track";
  name: string;
  artistName?: string;
  albumName?: string;
}

interface ArticleTagsProps {
  tags: ArticleTag[];
}

export function ArticleTags({ tags }: ArticleTagsProps) {
  return (
    <div className="rounded-2xl border p-5 bg-white">
      <h3 className="text-lg font-semibold mb-2">Etiquetas</h3>
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 && (
          <span className="px-3 py-1 rounded-full bg-black/5 text-sm">
            Sin etiquetas
          </span>
        )}
        {tags.map((tag) => {
          const tone =
            tag.type === "artist"
              ? "bg-purple-100 text-purple-800 border-purple-200"
              : tag.type === "album"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : tag.type === "track"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-gray-100 text-gray-800 border-gray-200";

          const href =
            tag.type === "artist"
              ? `/artists/${slugify(tag.name)}`
              : tag.type === "album"
              ? tag.artistName
                ? `/albums/${slugify(tag.artistName)}/${slugify(tag.name)}`
                : `/news?tag=${tag.id}`
              : tag.type === "track"
              ? tag.artistName && tag.albumName
                ? `/songs/${slugify(tag.artistName)}/${slugify(
                    tag.albumName
                  )}/${slugify(tag.name)}`
                : `/news?tag=${tag.id}`
              : `/news?tag=${tag.id}`;

          return (
            <Link
              key={tag.id}
              href={href}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:opacity-90 ${tone}`}
              title={`Ir a ${tag.type}: ${tag.name}`}
            >
              <span className="capitalize">{tag.type}</span>
              <span>·</span>
              <span className="font-medium">{tag.name}</span>
              {tag.type !== "artist" && tag.artistName ? (
                <span className="text-gray-600">({tag.artistName})</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
