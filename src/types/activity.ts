export type ActivityDisplay = {
  type: "artist" | "album" | "track";
  title?: string;
  artistName?: string;
  albumName?: string;
};

export type ActivityPost = {
  id: number;
  timestamp: string;
  content: string | null;
  itemId: number;
  itemType: "artist" | "album" | "track";
  display: ActivityDisplay;
  author: {
    id: number;
    username: string;
    fullname: string | null;
    profile_pic?: string | null;
  };
};
