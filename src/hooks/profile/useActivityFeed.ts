"use client";

import { useEffect, useState } from "react";
import { ActivityService } from "@/services/activity.service";
import { ActivityPost } from "@/types/activity";

export function useActivityFeed(userId: number, refreshToken: number = 0) {
  const TAKE = 10;
  const [items, setItems] = useState<ActivityPost[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const load = async (reset = false) => {
    if (loading) return;
    if (!reset && cursor == null) return;
    setLoading(true);
    try {
      const skip = reset ? 0 : cursor ?? 0;
      const page = await ActivityService.listByUser(userId, skip, TAKE);
      const newItems = reset ? page.items : [...items, ...page.items];
      setItems(newItems);
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: number) => {
    setItems((arr) => arr.filter((x) => x.id !== id));
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshToken]);

  return {
    items,
    loading,
    hasMore: cursor !== null,
    loadMore: () => load(false),
    removeItem,
  };
}
