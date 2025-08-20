// src/types/article.ts
export type Article = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published_date: string;
  image_url: string | null;
  views: number | null;
};

export type ListParams = {
  offset?: number;
  limit?: number;
};

export type ListResponse<T> = {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};

export type CreateArticleInput = {
  title: string;
  content: string;
  author_id: number;
  image_url?: string | null;
};

export type UpdateArticleInput = Partial<{
  title: string;
  content: string;
  image_url: string | null;
}>;
