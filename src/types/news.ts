// Tipos específicos para la UI de noticias
export interface NewsArticle {
  id: number;
  title: string;
  image_url?: string | null;
  published_date: string;
}

export interface NewsPageData {
  page: {
    data: NewsArticle[];
    hasMore: boolean;
  };
  featured: NewsArticle | null;
  rest: NewsArticle[];
  hasHero: boolean;
  prevOffset: number | null;
  nextOffset: number;
  offset: number;
}

// Tipos para el editor de artículos
export interface ArticleEditorUser {
  id: number;
  role_id: number;
}

export interface ArticleEditorPermissions {
  user: ArticleEditorUser;
  canEdit: boolean;
  isWriter: boolean;
  isEditor: boolean;
  isAdmin: boolean;
}
