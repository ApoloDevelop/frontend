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

// Tipos para el detalle de artículo
export interface ArticleDetailAuthor {
  username: string;
  fullname: string;
}

export interface ArticleDetailTag {
  id: number;
  type: "artist" | "album" | "track";
  name: string;
  artistName?: string;
  albumName?: string;
}

export interface ArticleDetailData {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published_date: string;
  image_url?: string | null;
  tags?: ArticleDetailTag[];
}

export interface RelatedArticleData {
  id: number;
  title: string;
  image_url?: string | null;
  published_date: string;
}
