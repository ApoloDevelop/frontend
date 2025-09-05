export type Review = {
  id: number;
  score: number;
  title?: string;
  text?: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    profile_pic?: string;
  };
};

export type ReviewCardData = {
  id: number;
  score: number;
  title?: string | null;
  text?: string | null;
  created_at: string;
  upvotes: number;
  downvotes: number;
  myVote: -1 | 0 | 1;
  user: { id: number; username: string; profile_pic?: string | null };
};

export type ReviewWithVotes = Review & {
  upvotes: number;
  downvotes: number;
  myVote: -1 | 0 | 1;
};

export type SortMode = "recent_desc" | "recent_asc" | "up_desc" | "up_asc";
