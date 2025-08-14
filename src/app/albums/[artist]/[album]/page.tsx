import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAlbumByName, fetchAlbumTracks } from "@/helpers/spotify";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import { RatingClient } from "@/components/reviews/RatingClient";
import { ReviewService } from "@/services/review.service";
import { Scores } from "@/components/reviews/Scores";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { fold, slugify } from "@/helpers/normalization";
import { AlbumTracklist } from "@/components/album/AlbumTracklist";
import { Hero } from "@/components/images/Hero";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

export default async function AlbumPage({
  params: rawParams,
}: {
  params: { artist: string; album: string };
}) {
  const { artist: artistSlug, album: albumSlug } = await rawParams;

  const artistName = decodeURIComponent(artistSlug.replace(/-/g, " "));
  const albumName = decodeURIComponent(albumSlug.replace(/-/g, " "));

  const album = await fetchAlbumByName(albumName, artistName);

  if (
    !album ||
    !album.artists?.some((a: any) => fold(a.name) === fold(artistName))
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

  const breadcrumbItems = [
    { label: "ARTISTAS", href: "/artists" },
    { label: artistName.toUpperCase(), href: `/artists/${artistSlug}` },
    {
      label: album.name.toUpperCase(),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      {/* HERO: fondo con blur + degradado para legibilidad */}
      <Hero cover={cover} />

      {/* CONTENIDO */}
      <div className="relative -mt-16 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <CustomBreadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-12 gap-8 mt-6">
            {/* ASIDE STICKY: cover + CTAs */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 space-y-4 self-start">
              <h1
                title={album.name}
                className="text-3xl md:text-4xl font-bold leading-tight"
              >
                {album.name}
                {year ? (
                  <span className="text-muted-foreground"> ({year})</span>
                ) : null}
              </h1>

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
                <FavoriteButton
                  type="album"
                  name={album.name}
                  artistName={artistName}
                  userId={1}
                />

                <AddToListDialog
                  userId={1}
                  itemType="album"
                  name={album.name}
                  artistName={artistName}
                />
                <a
                  href={album.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2 text-white hover:bg-green-700 transition"
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
                <p className="text-lg">
                  <span className="font-semibold">Artista:</span>{" "}
                  {album.artists?.map((artist: any, index: number) => (
                    <span key={artist.id || artist.name}>
                      <Link
                        href={`/artists/${slugify(artist.name)}`}
                        className="text-purple-600 hover:underline"
                        scroll
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

              <div className="w-full lg:w-[737px] justify-self-start">
                <Scores
                  verified={stats.verified}
                  unverified={stats.unverified}
                  verifiedCount={stats.verifiedCount}
                  unverifiedCount={stats.unverifiedCount}
                  itemId={stats.itemId}
                  name={album.name}
                  variant="card"
                />
              </div>

              {/* Tracklist */}
              <AlbumTracklist albumSlug={albumSlug} tracks={tracks} />

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
