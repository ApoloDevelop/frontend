export type SearchType = "artist" | "album" | "track";

export type PageRes<T> = {
  items: T[];
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  total: number;
};
