"use client";

import { useEffect } from "react";
import { useActivityFeed } from "@/hooks/profile/useActivityFeed";
import { useItemCovers } from "@/hooks/profile/useItemCovers";
import { usePermissions } from "@/hooks/profile/usePermissions";
import { useItemNavigation } from "@/hooks/profile/useItemNavigation";
import { ActivityCard } from "./ActivityCard";
import { LoadMoreButton } from "./LoadMoreButton";
import ActivityFeedSkeleton from "@/components/skeletons/ActivityFeedSkeleton";

export function ActivityFeed({
  userId,
  refreshToken = 0,
  currentUser = null,
  onDeleted,
}: {
  userId: number;
  refreshToken?: number;
  canDelete?: boolean;
  currentUser?: { id: number; role_id: number; username: string } | null;
  onDeleted?: (id: number) => void;
}) {
  // Usar los custom hooks
  const { items, loading, hasMore, loadMore, removeItem } = useActivityFeed(
    userId,
    refreshToken
  );
  const { itemCovers, loadCovers } = useItemCovers();
  const { canDeletePost } = usePermissions();
  const { getItemHref } = useItemNavigation();

  // Cargar covers cuando cambien los items
  useEffect(() => {
    if (items.length > 0) {
      loadCovers(items);
    }
  }, [items, loadCovers]);

  const handleDeleted = (id: number) => {
    removeItem(id);
    onDeleted?.(id);
  };

  return (
    <div className="mt-4">
      {/* Mostrar skeleton durante la carga inicial */}
      {loading && items.length === 0 ? (
        <ActivityFeedSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((post) => (
              <ActivityCard
                key={post.id}
                post={post}
                itemHref={getItemHref(post)}
                coverUrl={itemCovers[post.id]}
                canDelete={canDeletePost(post, currentUser)}
                onDeleted={handleDeleted}
              />
            ))}
          </div>

          <LoadMoreButton
            hasMore={hasMore}
            loading={loading}
            itemsCount={items.length}
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  );
}
