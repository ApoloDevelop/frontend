import React from "react";

interface AlbumCreditsProps {
  album: any;
}

export function AlbumCredits({ album }: AlbumCreditsProps) {
  const hasCredits = album.label || album.total_tracks || album.copyrights;

  if (!hasCredits) {
    return null;
  }

  return (
    <section className="pt-4 border-t">
      <h3 className="mb-2 text-xl font-semibold">Créditos</h3>
      <ul className="space-y-1 text-base">
        {typeof album.total_tracks === "number" ? (
          <li>
            <span className="font-semibold">Nº de pistas:</span>{" "}
            {album.total_tracks}
          </li>
        ) : null}

        {album.label ? (
          <li>
            <span className="font-semibold">Discográfica:</span> {album.label}
          </li>
        ) : null}

        {album.copyrights && album.copyrights.length > 0 ? (
          <li>
            <span className="font-semibold">Derechos:</span>
            <ul className="ml-4 mt-1 space-y-1">
              {album.copyrights.map((copyright: any, index: number) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {copyright.text}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
