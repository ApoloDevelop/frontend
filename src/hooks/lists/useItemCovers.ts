import { useState } from "react";
import { SpotifyService } from "@/services/spotify.service";
import { ItemType2 } from "@/types/items";
import { ListItem } from "@/types/lists";

export function useItemCovers() {
  const [itemCovers, setItemCovers] = useState<Record<number, string>>({});

  const getCoverForItem = async (
    item: ListItem,
    itemType: ItemType2
  ): Promise<string> => {
    try {
      const { name, artistName, albumName } = item.item || {};

      if (itemType === "artist") {
        const artist = await SpotifyService.fetchArtistByName(name || "");
        return artist?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "album" && artistName) {
        const album = await SpotifyService.fetchAlbumByName(
          name || "",
          artistName
        );
        return album?.images?.[0]?.url || "/default-cover.png";
      }

      if (itemType === "track" && artistName) {
        const track = await SpotifyService.fetchSongByName(
          name || "",
          albumName,
          artistName
        );
        return track?.album?.images?.[0]?.url || "/default-cover.png";
      }

      return "/default-cover.png";
    } catch (error) {
      console.warn("Error loading cover for item:", error);
      return "/default-cover.png";
    }
  };

  const loadCovers = async (items: ListItem[], itemType: ItemType2) => {
    const newCovers: Record<number, string> = {};

    await Promise.all(
      items.map(async (item) => {
        const itemKey = item.item?.id || item.itemId;

        if (!itemCovers[itemKey]) {
          const cover = await getCoverForItem(item, itemType);
          newCovers[itemKey] = cover;
        }
      })
    );

    if (Object.keys(newCovers).length > 0) {
      setItemCovers((prev) => ({ ...prev, ...newCovers }));
    }
  };

  const getCoverUrl = (item: ListItem): string => {
    const itemKey = item.item?.id || item.itemId;
    return itemCovers[itemKey] || "/default-cover.png";
  };

  return {
    itemCovers,
    loadCovers,
    getCoverUrl,
  };
}
