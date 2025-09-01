import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CardTitle } from "../ui/card";
import { DeleteButton } from "./DeleteButton";
import { ReviewCardData } from "@/types/reviews";
import Link from "next/link";

interface ReviewHeaderProps {
  review: ReviewCardData;
  currentUserId?: number | null;
  canModerate: boolean;
  onDelete: (reviewId: number) => void;
}

export function ReviewHeader({
  review,
  currentUserId,
  canModerate,
  onDelete,
}: ReviewHeaderProps) {
  const net = review.upvotes - review.downvotes;
  const netClass =
    net > 0
      ? "text-green-600"
      : net < 0
      ? "text-red-600"
      : "text-muted-foreground";

  const canDelete = review.user?.id === currentUserId || canModerate;

  return (
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
        {review.user.profile_pic ? (
          <AvatarImage
            src={review.user.profile_pic}
            alt={review.user.username}
          />
        ) : (
          <AvatarFallback>{review.user.username.charAt(0)}</AvatarFallback>
        )}
      </Avatar>

      <div className="min-w-0 flex-1">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <span className="truncate">{review.title || "Sin título"}</span>
          <span className="shrink-0 font-mono bg-gray-100 px-2 py-0.5 rounded">
            {review.score}
          </span>
        </CardTitle>

        <DeleteButton
          reviewId={review.id}
          canDelete={canDelete}
          onDelete={onDelete}
        />

        <div className="mt-1 text-sm sm:text-[0.95rem] text-gray-700 italic">
          <Link
            href={`/users/${review.user.username}`}
            className="hover:text-purple-600 hover:underline transition-colors cursor-pointer"
          >
            {review.user.username}
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          {require("dayjs")(review.created_at)
            .locale("es")
            .format("DD MMM YYYY")}
        </div>
      </div>

      <div
        className={`text-sm sm:text-base font-semibold ${netClass} shrink-0`}
      >
        {net > 0 ? `+${net}` : `${net}`}
      </div>
    </div>
  );
}
