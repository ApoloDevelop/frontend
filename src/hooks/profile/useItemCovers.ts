"use client";

import { useEffect, useState } from "react";
import { SpotifyService } from "@/services/spotify.service";
import { ActivityPost } from "@/types/activity";

export function useItemCovers() {
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});

  // Función para obtener el cover de un item
  const getCoverForItem = async (post: ActivityPost): Promise<string> => {
    try {
      const { itemType, display } = post;

      if (itemType === "artist") {
        const artist = await SpotifyService.fetchArtistByName(
          display.title || ""
        );
        return artist?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "album" && display.artistName) {
        const album = await SpotifyService.fetchAlbumByName(
          display.title || "",
          display.artistName
        );
        return album?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "track" && display.artistName) {
        const track = await SpotifyService.fetchSongByName(
          display.title || "",
          display.albumName,
          display.artistName
        );
        return track?.album?.images?.[0]?.url || "/default-cover.png";
      }

      return "/default-cover.png";
    } catch (error) {
      console.warn("Error loading cover for item:", error);
      return "/default-cover.png";
    }
  };

  // Cargar covers para los items
  const loadCovers = async (posts: ActivityPost[]) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      posts.map(async (post) => {
        if (!itemCovers[post.id]) {
          const cover = await getCoverForItem(post);
          newCovers[post.id] = cover;
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => ({ ...prev, ...newCovers }));
    }
  };

  return {
    itemCovers,
    loadCovers,
  };
}
