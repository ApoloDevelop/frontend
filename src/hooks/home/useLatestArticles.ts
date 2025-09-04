import { ArticlesService } from "@/services/articles.service";

export async function useLatestArticles(limit: number = 5) {
  try {
    const { data: latest } = await ArticlesService.list({ offset: 0, limit });
    return latest;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}
