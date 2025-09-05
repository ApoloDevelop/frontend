"use client";

import type { Comment } from "@/types/comment";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  c: Comment;
  currentUserId?: number | null;
  onReply?: () => void;
  onDelete?: () => void;
};

export default function CommentItem({
  c,
  currentUserId,
  onReply,
  onDelete,
}: Props) {
  const isOwner = !!currentUserId && currentUserId === c.user_id;

  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8">
        {c.user?.profile_pic ? (
          <AvatarImage src={c.user.profile_pic} alt={c.user.username ?? ""} />
        ) : (
          <AvatarFallback>
            {c.user?.username?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {c.user?.username ?? `Usuario #${c.user_id}`}
          </span>
          <time className="text-xs text-gray-500">
            {new Date(c.created_at).toLocaleString()}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-wrap">{c.content}</p>

        <div className="mt-2 flex gap-3 text-sm text-gray-600">
          {onReply && (
            <button
              onClick={onReply}
              className="hover:underline cursor-pointer"
            >
              Responder
            </button>
          )}
          {isOwner && onDelete && (
            <button
              onClick={onDelete}
              className="hover:underline text-red-600 cursor-pointer"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
