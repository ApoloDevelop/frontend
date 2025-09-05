import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CardTitle } from "../ui/card";
import { DeleteButton } from "./DeleteButton";
import { ReviewCardData } from "@/types/reviews";
import { BadgeCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ReviewHeaderProps {
  review: ReviewCardData;
  currentUserId?: number | null;
  canModerate: boolean;
  onDelete: (reviewId: number) => void;
  verified: boolean;
}

export function ReviewHeader({
  review,
  currentUserId,
  canModerate,
  onDelete,
  verified,
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
          <div className="flex items-center gap-1">
            <Link
              href={`/users/${review.user.username}`}
              className="hover:text-purple-600 hover:underline transition-colors cursor-pointer"
            >
              {review.user.username}
            </Link>
            {verified && (
              <div title="Verificado" className="inline-flex">
                <Badge
                  variant="verified"
                  className="flex items-center gap-1 px-1 py-0"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Badge>
              </div>
            )}
          </div>
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
