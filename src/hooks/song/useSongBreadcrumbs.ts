import { useMemo } from "react";
import { slugify, wrapWord } from "@/utils/normalization";

interface UseSongBreadcrumbsProps {
  artistName: string;
  artistSlug: string;
  albumName: string;
  albumSlug: string;
  songName: string;
}

export function useSongBreadcrumbs({
  artistName,
  artistSlug,
  albumName,
  albumSlug,
  songName,
}: UseSongBreadcrumbsProps) {
  const breadcrumbItems = useMemo(
    () => [
      { label: "ARTISTAS" },
      {
        label: wrapWord(artistName).toUpperCase(),
        href: `/artists/${artistSlug}`,
      },
      {
        label: wrapWord(albumName).toUpperCase(),
        href: `/albums/${artistSlug}/${albumSlug}`,
      },
      {
        label: wrapWord(songName).toUpperCase(),
        isCurrentPage: true,
      },
    ],
    [artistName, artistSlug, albumName, albumSlug, songName]
  );

  return { breadcrumbItems };
}
