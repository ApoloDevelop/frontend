import React from "react";
import { Hero } from "@/components/images/Hero";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { AlbumSidebar } from "./AlbumSidebar";
import { AlbumMainContent } from "./AlbumMainContent";

interface AlbumLayoutProps {
  album: any;
  tracks: any[];
  stats: any;
  artistName: string;
  albumSlug: string;
  albumMetadata: {
    cover: string;
    year?: number;
    releaseDate?: string | null;
    genre?: string | null;
    spotifyUrl?: string;
  };
  breadcrumbItems: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
  user?: {
    id: number;
    role_id: number;
  } | null;
}

export function AlbumLayout({
  album,
  tracks,
  stats,
  artistName,
  albumSlug,
  albumMetadata,
  breadcrumbItems,
  user,
}: AlbumLayoutProps) {
  return (
    <>
      {/* HERO: fondo con blur + degradado para legibilidad */}
      <Hero cover={albumMetadata.cover} />

      {/* CONTENIDO */}
      <div className="relative -mt-16 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <CustomBreadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-12 gap-8 mt-6">
            {/* ASIDE STICKY: cover + CTAs */}
            <AlbumSidebar
              albumName={album.name}
              year={albumMetadata.year}
              cover={albumMetadata.cover}
              artistName={artistName}
              itemId={stats.itemId ?? null}
              spotifyUrl={albumMetadata.spotifyUrl}
              user={user}
            />

            {/* MAIN: título, metadatos, tracklist, créditos */}
            <AlbumMainContent
              album={album}
              artistName={artistName}
              albumMetadata={albumMetadata}
              stats={stats}
              tracks={tracks}
              albumSlug={albumSlug}
              user={user}
            />
          </div>
        </div>
      </div>
    </>
  );
}
