import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Play, MoreHorizontal } from "lucide-react";
import { fetchAlbumByName, fetchAlbumTracks } from "@/helpers/spotify";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { msToMinSec } from "@/helpers/seconds";
import { RatingClient } from "@/components/artist/RatingClient";
import { ReviewService } from "@/services/review.service";
import { PentagramScores } from "@/components/artist/PentagramScores";

export default async function AlbumPage({
  params: rawParams,
}: {
  params: { artist: string; album: string };
}) {
  const { artist: artistSlug, album: albumSlug } = await rawParams;

  const artistName = artistSlug.replace(/-/g, " ");
  const albumName = decodeURIComponent(albumSlug.replace(/-/g, " "));

  const album = await fetchAlbumByName(albumName);

  if (
    !album ||
    !album.artists?.some(
      (a: any) => a.name?.toLowerCase() === artistName.toLowerCase()
    )
  ) {
    return notFound();
  }

  const tracks = await fetchAlbumTracks(album.id);
  const stats = await ReviewService.getAlbumReviewStats(album.name, artistName);

  const cover = album.images?.[0]?.url || "/default-cover.png";
  const year =
    album.release_date && !Number.isNaN(new Date(album.release_date).getTime())
      ? new Date(album.release_date).getFullYear()
      : undefined;

  return (
    <>
      {/* HERO: fondo con blur + degradado para legibilidad */}
      <div className="relative h-72 mb-18 w-full overflow-hidden">
        <Image
          src={cover}
          alt=""
          fill
          priority
          className="object-cover scale-110 blur-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-transparent pointer-events-none" />
      </div>

      {/* CONTENIDO */}
      <div className="relative -mt-16 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/artists">Artistas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/artists/${artistSlug}`}>
                  {artistName.toUpperCase()}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{album.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-12 gap-8 mt-6">
            {/* ASIDE STICKY: cover + CTAs */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 space-y-4 self-start">
              <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-lg bg-white">
                <Image
                  src={cover}
                  alt={`Cover de ${album.name}`}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <RatingClient
                name={album.name}
                type="album"
                userId={1}
                artistName={artistName}
              />
              <div className="flex flex-wrap items-center gap-3">
                {/* CTA primario */}

                {/* Secundarios en ghost */}
                <Button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-black/5 transition"
                  aria-label="Añadir a favoritos"
                >
                  <Heart size={18} />
                  <span>Favorito</span>
                </Button>

                <Button
                  type="button"
                  className="inline-flex items-center rounded-xl border p-2 hover:bg-black/5 transition"
                  aria-label="Más opciones"
                >
                  <MoreHorizontal size={18} />
                </Button>
                <a
                  href={album.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-white hover:bg-green-800 transition"
                >
                  <SpotifyLogo />
                  <span>Reproducir en Spotify</span>
                </a>
              </div>
            </aside>

            {/* MAIN: título, metadatos, tracklist, créditos */}
            <main className="col-span-12 md:col-span-8 space-y-8">
              {/* Título + metadatos */}
              <header className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {album.name}
                  {year ? (
                    <span className="text-muted-foreground"> ({year})</span>
                  ) : null}
                </h1>

                <p className="text-lg">
                  <span className="font-semibold">Artista:</span>{" "}
                  {album.artists?.map((artist: any, index: number) => (
                    <span key={artist.id || artist.name}>
                      <Link
                        href={`/artists/${artist.name
                          ?.replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="text-purple-600 hover:underline"
                      >
                        {artist.name}
                      </Link>
                      {index < album.artists.length - 1 && ", "}
                    </span>
                  ))}
                </p>

                {album.release_date ? (
                  <p className="text-lg">
                    <span className="font-semibold">Lanzamiento:</span>{" "}
                    <span
                      title={new Date(album.release_date).toLocaleDateString()}
                    >
                      {new Date(album.release_date).toLocaleDateString()}
                    </span>
                  </p>
                ) : null}

                {album.genres && album.genres.length > 0 ? (
                  <p className="text-lg">
                    <span className="font-semibold">Género:</span>{" "}
                    {album.genres[0]}
                  </p>
                ) : null}
              </header>

              <div className="flex justify-end">
                <PentagramScores
                  verified={stats.verified}
                  unverified={stats.unverified}
                  verifiedCount={stats.verifiedCount}
                  unverifiedCount={stats.unverifiedCount}
                  itemId={stats.itemId}
                  name={album.name}
                />
              </div>

              {/* Tracklist */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Tracklist</h2>
                <ol className="divide-y rounded-xl border">
                  {tracks.map((t: any, idx: number) => {
                    const name = t?.name ?? t?.track?.name ?? "Untitled";
                    const artists = (t?.artists ??
                      t?.track?.artists ??
                      []) as any[];
                    const durationMs =
                      t?.duration_ms ?? t?.track?.duration_ms ?? 0;
                    return (
                      <li
                        key={t.id || `${name}-${idx}`}
                        className="grid grid-cols-[32px_1fr_auto] items-center gap-4 px-3 py-2 hover:bg-black/5 cursor-pointer"
                      >
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="truncate font-medium hover:underline">
                            {name}
                          </div>
                          <div className="truncate text-sm text-muted-foreground">
                            {artists.map((a: any, i: number) => (
                              <span key={a.id || `${a.name}-${i}`}>
                                <Link
                                  href={`/artists/${a.name
                                    ?.replace(/\s+/g, "-")
                                    .toLowerCase()}`}
                                  className="hover:underline"
                                >
                                  {a.name}
                                </Link>
                                {i < artists.length - 1 && ", "}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span className="text-sm tabular-nums text-muted-foreground">
                          {msToMinSec(durationMs)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </section>

              {/* Créditos */}
              {(album.label || album.total_tracks) && (
                <section className="pt-4 border-t">
                  <h3 className="mb-2 text-xl font-semibold">Créditos</h3>
                  <ul className="space-y-1 text-base">
                    {album.label ? (
                      <li>
                        <span className="font-semibold">Discográfica:</span>{" "}
                        {album.label}
                      </li>
                    ) : null}
                    {typeof album.total_tracks === "number" ? (
                      <li>
                        <span className="font-semibold">Nº de pistas:</span>{" "}
                        {album.total_tracks}
                      </li>
                    ) : null}
                  </ul>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
