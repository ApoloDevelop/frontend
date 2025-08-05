import Image from "next/image";
import { notFound } from "next/navigation";

import { Heart, Play, MoreHorizontal } from "lucide-react";
import { fetchAlbumByName, fetchAlbumTracks } from "@/helpers/spotify";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import Link from "next/link";

export default async function AlbumPage({
  params: rawParams,
}: {
  params: { artist: string; album: string };
}) {
  const { artist: artistSlug, album: albumSlug } = await rawParams;
  const rawAlbum = albumSlug.replace(/-/g, " ");
  const decodedAlbum = decodeURIComponent(rawAlbum);
  const artistName = artistSlug.replace(/-/g, " ");
  const albumName = decodedAlbum;
  const album = await fetchAlbumByName(albumName);

  if (
    !album ||
    !album.artists.some(
      (a: any) => a.name.toLowerCase() === artistName.toLowerCase()
    )
  ) {
    return notFound();
  }

  const tracks = await fetchAlbumTracks(album.id);

  return (
    <>
      {/* Banner con imagen blurred */}
      <div
        className="relative h-100 -z-10 w-full top-10 mb-20"
        style={{
          backgroundImage: `url(${
            album.images?.[0]?.url || "/default-cover.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
        }}
      ></div>

      {/* Contenido principal */}
      <div className="relative max-w-5xl mx-auto px-4 grid gap-24 lg:grid-cols-2">
        {/* Portada del álbum */}
        <div className="w-full h-auto aspect-square overflow-hidden rounded-2xl shadow-lg -translate-y-40 -translate-x-80">
          {album.images?.[0]?.url ? (
            <Image
              src={album.images[0].url}
              alt={`Cover de ${album.title}`}
              width={512}
              height={512}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Sin portada</span>
            </div>
          )}
        </div>

        {/* Información y contenido */}
        <div className="flex flex-col space-y-6">
          {/* Título y metadatos */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{album.name}</h1>
            <p className="text-lg">
              <span className="font-semibold">Artista:</span>{" "}
              {album.artists.map((artist: any, index: number) => (
                <span key={artist.id}>
                  <Link
                    href={`/artists/${artist.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                    className="text-purple-500 hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {index < album.artists.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Fecha de lanzamiento:</span>{" "}
              {new Date(album.release_date).toLocaleDateString()}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Género:</span>{" "}
              {album.genres?.[0] ?? "N/A"}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-4">
            <a
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition"
            >
              <SpotifyLogo />
              <span>Reproducir en Spotify</span>
            </a>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              <Heart size={20} />
              <span>Favorite</span>
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-100 transition">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Tracklist */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tracklist</h2>
            <ol className="space-y-2">
              {tracks.map((track: any, idx: number) => (
                <li key={track.id || idx} className="flex justify-between">
                  <span>
                    {idx + 1}. {track.track ? track.track.name : track.name}
                  </span>
                  <span className="font-mono">
                    {track.track
                      ? new Date(track.track.duration_ms)
                          .toISOString()
                          .substr(14, 5)
                      : track.duration_ms
                      ? new Date(track.duration_ms).toISOString().substr(14, 5)
                      : "0:00"}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Créditos */}
          <div className="pt-6 border-t">
            <h3 className="text-xl font-semibold mb-2">Credits</h3>
            <ul className="space-y-1">
              {album.label && (
                <li>
                  <span className="font-semibold">Label:</span> {album.label}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
