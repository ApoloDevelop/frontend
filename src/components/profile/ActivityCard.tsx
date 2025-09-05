"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { ActivityPost } from "@/types/activity";
import { ExpandableContent } from "./ExpandableContent";
import { ItemDisplay } from "./ItemDisplay";
import { DeleteButton } from "./DeleteButton";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface ActivityCardProps {
  post: ActivityPost;
  itemHref: string;
  coverUrl: string;
  canDelete: boolean;
  onDeleted: (id: number) => void;
}

export function ActivityCard({
  post,
  itemHref,
  coverUrl,
  canDelete,
  onDeleted,
}: ActivityCardProps) {
  return (
    <Card className="overflow-hidden h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          <Link
            href={`/users/${post.author.username}`}
            className="hover:underline"
          >
            {post.author.username}
          </Link>{" "}
          <span className="text-xs text-muted-foreground block mt-1">
            {dayjs(post.timestamp).fromNow()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <ItemDisplay post={post} itemHref={itemHref} coverUrl={coverUrl} />
        {post.content && <ExpandableContent content={post.content} />}
        {canDelete && <DeleteButton postId={post.id} onDeleted={onDeleted} />}
      </CardContent>
    </Card>
  );
}
