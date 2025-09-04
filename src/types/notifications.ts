export interface Notification {
  id: number;
  type: "comment_reply" | "new_follower" | "review_upvote";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  comment?: {
    id: number;
    content: string;
    user: {
      username: string;
      fullname: string;
      profile_pic: string | null;
    };
    article: {
      id: number;
      title: string;
    };
  };
  follower?: {
    id: number;
    username: string;
    fullname: string;
    profile_pic: string | null;
  };
  review?: {
    id: number;
    title: string | null;
    item: {
      id: number;
      item_type: string;
      item_id: number;
      artist?: {
        name: string;
      }[];
      album?: {
        name: string;
        album_artist: {
          artist: {
            name: string;
          };
        }[];
      }[];
      track?: {
        title: string;
        track_artist: {
          artist: {
            name: string;
          };
        }[];
        track_album: {
          album: {
            name: string;
          };
        }[];
      }[];
    };
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
}
