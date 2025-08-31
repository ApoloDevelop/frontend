import { RelatedArticles } from "./RelatedArticles";
import { ArticleTags } from "./ArticleTags";

interface RelatedArticle {
  id: number;
  title: string;
  image_url?: string | null;
  published_date: string;
}

interface ArticleTag {
  id: number;
  type: "artist" | "album" | "track";
  name: string;
  artistName?: string;
  albumName?: string;
}

interface ArticleSidebarProps {
  relatedArticles: RelatedArticle[];
  tags: ArticleTag[];
}

export function ArticleSidebar({ relatedArticles, tags }: ArticleSidebarProps) {
  return (
    <aside className="col-span-12 lg:col-span-4 space-y-6">
      <RelatedArticles articles={relatedArticles} />
      <ArticleTags tags={tags} />
    </aside>
  );
}
