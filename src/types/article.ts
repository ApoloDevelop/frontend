// src/types/article.ts
export type Article = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published_date: string;
  image_url: string | null;
  tags?: Array<{
    id: number; // ← id del tag (tabla tag)
    name: string;
    type: TagType;
    artistName?: string;
    albumName?: string;
    // opcionalmente podrías añadir artistName si lo expones más adelante
  }>;
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
  tags?: TagDraft[];
};

export type UpdateArticleInput = Partial<{
  title: string;
  content: string;
  image_url: string | null;
}>;

export type TagType = "artist" | "album" | "track";
export type TagDraft = {
  type: TagType;
  // nombre principal (artist.name | album.name | track.name)
  name: string;
  // contexto opcional para item service
  artistName?: string;
  albumName?: string;
};
