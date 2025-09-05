import { ActivityPost } from "@/types/activity";
import { slugify } from "@/utils/normalization";

export function useItemNavigation() {
  // Función para generar el href según el tipo de item
  const getItemHref = (post: ActivityPost): string => {
    const { itemType, display } = post;

    if (itemType === "artist" && display.title) {
      return `/artists/${slugify(display.title)}`;
    }

    if (itemType === "album" && display.title && display.artistName) {
      return `/albums/${slugify(display.artistName)}/${slugify(display.title)}`;
    }

    if (
      itemType === "track" &&
      display.title &&
      display.artistName &&
      display.albumName
    ) {
      return `/songs/${slugify(display.artistName)}/${slugify(
        display.albumName
      )}/${slugify(display.title)}`;
    }

    // Fallback en caso de que falten datos
    return "#";
  };

  return {
    getItemHref,
  };
}
