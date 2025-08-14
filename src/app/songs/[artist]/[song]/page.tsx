// app/apolo/[artist]/[song]/page.tsx
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import { Hero } from "@/components/images/Hero";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { RatingClient } from "@/components/reviews/RatingClient";
import { Scores } from "@/components/reviews/Scores";
import { fold, slugify } from "@/helpers/normalization";
import { msToMinSec } from "@/helpers/seconds";
import { fetchSongByName } from "@/helpers/spotify";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// --- utils locales (sin dependencias) ---
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// --- datos de ejemplo (placeholders) ---
function getMockData(songName: string) {
  return {
    genres: ["latin pop", "reggaeton"],
    bpm: 98,
    keyIndex: 8, // G#
    mode: "minor" as "major" | "minor",
    lyrics: `Verso 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pre-coro
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Coro
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
    credits: {
      composers: ["Compositor A", "Compositora B"],
      producers: ["Productor X", "Productora Y"],
      writers: ["Autor 1", "Autor 2"],
      label: "Apolo Music / Distribuido por Ficticia Records",
    },
    external: {
      spotify: "#", // enlace ficticio
    },
  };
}

export default async function SongPage({
  params: rawParams,
}: {
  params: { artist: string; song: string };
}) {
  const { artist: artistSlug, song: songSlug } = await rawParams;

  const artistName = decodeURIComponent(artistSlug.replace(/-/g, " "));
  const songName = decodeURIComponent(songSlug.replace(/-/g, " "));
  const mock = getMockData(songName);

  const keyText =
    NOTE_NAMES[mock.keyIndex] + (mock.mode === "minor" ? "m" : "");

  let track = await fetchSongByName(`${songName} ${artistName}`).catch(
    () => null
  );

  // 2) Fallback: solo "canción"
  if (
    !track ||
    !track.artists?.some((a: any) => fold(a.name) === fold(artistName))
  ) {
    track = await fetchSongByName(songName).catch(() => null);
  }

  // 3) Validación final por artista
  if (
    !track ||
    !track.artists?.some((a: any) => fold(a.name) === fold(artistName))
  ) {
    return notFound();
  }

  const cover = track.album?.images?.[0]?.url || "/default-cover.png";
  const durationMs = track.duration_ms ?? 0;
  const explicit = !!track.explicit;
  const albumRelease = track.album?.release_date ?? null;
  const albumName = track.album?.name || "-";

  return (
    <>
      {/* HERO con blur */}
      <Hero cover={cover} type="song" />

      <div className="relative -mt-12 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* ASIDE: portada + CTAs (placeholders) */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 self-start space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {track.name}
              </h1>

              <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-lg bg-white">
                <Image
                  src={cover}
                  alt={`Cover de ${songName}`}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              {/* metainformación comprimida */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{msToMinSec(durationMs)}</span>
                <span aria-hidden>•</span>
                <time dateTime={albumRelease}>
                  {new Date(albumRelease).toLocaleDateString()}
                </time>
                {!!mock.genres.length && (
                  <>
                    <span aria-hidden>•</span>
                    <span className="capitalize">{mock.genres[0]}</span>
                  </>
                )}
                {explicit && (
                  <>
                    <span aria-hidden>•</span>
                    <span
                      className="inline-flex items-center rounded-md bg-black/5 px-2 py-0.5 cursor-pointer"
                      title="Contenido explícito"
                    >
                      E
                    </span>
                  </>
                )}
              </div>

              {/* Botones “inertes” (sin servicios) */}

              <RatingClient
                name={track.name}
                type="track"
                userId={1}
                artistName={track.artists[0]?.name || ""}
              />
              <div className="flex flex-wrap items-center gap-3">
                <FavoriteButton
                  type="track"
                  name={track.name}
                  artistName={track.artists[0]?.name || ""}
                  userId={1}
                />
                <AddToListDialog
                  itemType="track"
                  name={track.name}
                  userId={1}
                  artistName={track.artists[0]?.name || ""}
                />
                <a
                  href={track.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2 text-white hover:bg-green-700 transition"
                >
                  <SpotifyLogo />
                  <span>Reproducir en Spotify</span>
                </a>
              </div>
            </aside>

            {/* MAIN */}
            <main className="col-span-12 md:col-span-8 space-y-8">
              {/* Artistas + badges BPM/Key */}
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-lg">
                    <span className="font-semibold">Artista/s:</span>{" "}
                    {track.artists?.map((a: any, i: number) => (
                      <span key={a.id || a.name}>
                        <Link
                          href={`/artists/${slugify(a.name)}`}
                          className="text-purple-600 hover:underline"
                          scroll
                        >
                          {a.name}
                        </Link>
                        {i < track.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Fecha de salida:</span>{" "}
                    <time dateTime={albumRelease}>
                      {new Date(albumRelease).toLocaleDateString()}
                    </time>
                  </p>
                  {!!mock.genres.length && (
                    <p className="text-lg">
                      <span className="font-semibold">Género/s:</span>{" "}
                      <span className="capitalize">
                        {mock.genres.join(", ")}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    aria-label="BPM"
                    className="min-w-16 rounded-xl bg-purple-100 px-3 py-2 text-center"
                  >
                    <div className="text-xs uppercase tracking-wide text-purple-700">
                      BPM
                    </div>
                    <div className="text-2xl font-bold">{mock.bpm}</div>
                  </div>
                  <div
                    aria-label="Key"
                    className="min-w-16 rounded-xl bg-gray-100 px-3 py-2 text-center"
                  >
                    <div className="text-xs uppercase tracking-wide text-gray-600">
                      Key
                    </div>
                    <div className="text-2xl font-bold">{keyText}</div>
                  </div>
                </div>
              </header>

              {/* Valoraciones (placeholder estático) */}
              <section className="w-full lg:w-[737px]">
                <Scores
                  verified={4.5}
                  unverified={3.8}
                  verifiedCount={100}
                  unverifiedCount={50}
                  itemId={1}
                  name={track.name}
                  variant="card"
                />
              </section>

              {/* Letra */}
              <section aria-labelledby="lyrics-title">
                <h2 id="lyrics-title" className="mb-3 text-2xl font-semibold">
                  Letra
                </h2>
                <div className="rounded-xl border p-4 leading-relaxed text-gray-800 bg-white whitespace-pre-wrap">
                  {mock.lyrics}
                </div>
              </section>

              {/* Créditos */}
              <section aria-labelledby="credits-title">
                <h2 id="credits-title" className="mb-3 text-2xl font-semibold">
                  Créditos
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4 bg-white">
                    <h3 className="font-semibold mb-2">Compositores</h3>
                    <ul className="list-disc list-inside">
                      {mock.credits.composers.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4 bg-white">
                    <h3 className="font-semibold mb-2">Productores</h3>
                    <ul className="list-disc list-inside">
                      {mock.credits.producers.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4 bg-white md:col-span-2">
                    <h3 className="font-semibold mb-2">Autores</h3>
                    <ul className="list-disc list-inside">
                      {mock.credits.writers.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4 bg-white md:col-span-2">
                    <h3 className="font-semibold mb-2">
                      Label / Distribuidora
                    </h3>
                    <p className="text-gray-700">{mock.credits.label}</p>
                  </div>
                </div>
              </section>

              {/* En el álbum */}
              {track.album && (
                <section>
                  <h2 className="mb-3 text-2xl font-semibold">En el álbum</h2>
                  <Link
                    href={`/albums/${artistSlug}/${slugify(albumName)}`}
                    className="group inline-flex items-center gap-4 rounded-xl border p-3 pr-5 bg-white hover:bg-black/5 transition"
                    scroll
                  >
                    <Image
                      src={cover}
                      alt={albumName}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{albumName}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {track.album.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>
                  </Link>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
