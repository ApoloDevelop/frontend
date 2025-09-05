import { NewsCard } from "./NewsCard";
import { NewsArticle } from "@/types/news";

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:[grid-template-columns:repeat(2,minmax(0,1fr))] xl:[grid-template-columns:repeat(3,minmax(0,1fr))] 2xl:[grid-template-columns:repeat(3,minmax(0,1fr))]">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
