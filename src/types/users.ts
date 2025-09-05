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
  isFollowing?: boolean | null; // null si no hay usuario autenticado o es el mismo usuario
};

export type FollowType = "followers" | "following";
