import { MessageCircle, UserPlus, Heart, Bell } from "lucide-react";

interface NotificationIconProps {
  type: string;
}

export function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case "comment_reply":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "new_follower":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "review_upvote":
      return <Heart className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
}
