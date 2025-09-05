import { useMemo } from "react";

interface UseBreadcrumbsProps {
  artistName: string;
  artistSlug: string;
  albumName: string;
}

export function useBreadcrumbs({
  artistName,
  artistSlug,
  albumName,
}: UseBreadcrumbsProps) {
  const breadcrumbItems = useMemo(
    () => [
      { label: "ARTISTAS" },
      { label: artistName.toUpperCase(), href: `/artists/${artistSlug}` },
      {
        label: albumName.toUpperCase(),
        isCurrentPage: true,
      },
    ],
    [artistName, artistSlug, albumName]
  );

  return { breadcrumbItems };
}
