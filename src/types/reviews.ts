export type Review = {
  id: number;
  score: number;
  title?: string;
  text?: string;
  user: {
    id: number;
    username: string;
    profile_pic?: string;
  };
};

export type ReviewWithVotes = Review & {
  upvotes: number;
  downvotes: number;
  myVote: -1 | 0 | 1;
};
