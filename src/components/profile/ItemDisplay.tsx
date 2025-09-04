"use client";

import Image from "next/image";
import Link from "next/link";
import { ActivityPost } from "@/types/activity";

interface ItemDisplayProps {
  post: ActivityPost;
  itemHref: string;
  coverUrl: string;
}

export function ItemDisplay({ post, itemHref, coverUrl }: ItemDisplayProps) {
  return (
    <Link href={itemHref} className="block">
      <div className="mb-3 flex items-center gap-3 hover:bg-black/5 rounded-lg p-2 -m-2 transition-colors -mt-8">
        {/* Cover del item */}
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={coverUrl || "/default-cover.png"}
            alt={post.display.title || "Cover"}
            fill
            className="object-cover rounded-md"
            sizes="64px"
          />
        </div>

        {/* Información del item */}
        <div className="flex-1 min-w-0">
          <span className="uppercase text-[10px] text-muted-foreground mr-2">
            {post.itemType}
          </span>
          <h4 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
            {post.display.title}
          </h4>
          {post.display.artistName && (
            <p className="text-muted-foreground text-xs line-clamp-1">
              {post.display.artistName}
            </p>
          )}
          {post.display.albumName && (
            <p className="text-muted-foreground text-xs line-clamp-1">
              {post.display.albumName}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
