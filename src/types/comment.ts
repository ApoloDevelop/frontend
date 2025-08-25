export type CommentUser = {
  id: number;
  username: string | null;
  profile_pic: string | null;
};

export type Comment = {
  id: number;
  article_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string; // ISO
  user: CommentUser;
  other_comment?: Comment[];
};

export type CommentListResponse = {
  data: Comment[];
  nextCursor: number | null;
  hasMore: boolean;
  totalParents: number;
  limit: number;
};
