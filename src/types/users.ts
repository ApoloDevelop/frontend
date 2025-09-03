export type FollowSummary = {
  followers: number;
  following: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
};

export type UserLite = {
  id: number;
  username: string;
  fullname: string;
  profile_pic?: string | null;
};

export type FollowType = "followers" | "following";
