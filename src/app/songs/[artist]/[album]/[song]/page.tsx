// app/apolo/[artist]/[song]/page.tsx
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import SpotifyLogo from "@/components/icons/SpotifyLogo";
import { Hero } from "@/components/images/Hero";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { RatingClient } from "@/components/reviews/RatingClient";
import { Scores } from "@/components/reviews/Scores";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { deslugify, slugify, wrapWord } from "@/helpers/normalization";
import { msToMinSec } from "@/helpers/seconds";
import { fetchSongByName } from "@/helpers/spotify";
import { normalizeRole, roleLabelEs, sortCollabs } from "@/helpers/collabs";
import { SongstatsService } from "@/services/songstats.service";
import Image from "next/image";
import Link from "next/link";
import { GeniusService } from "@/services/genius.service";
import { LyricsDisplayer } from "@/components/song/LyricsDisplayer";
import { mockTrackData } from "@/mocks/mockSongstats";

export default async function SongPage({
  params: rawParams,
}: {
  params: { artist: string; album: string; song: string };
}) {
  const {
    artist: artistSlug,
    album: albumSlug,
    song: songSlug,
  } = await rawParams;

  const artistName = deslugify(artistSlug);
  const albumName = deslugify(albumSlug);
  const songName = deslugify(songSlug);
  console.log("Song name:", songName);

  const track = await fetchSongByName(songName, albumName, artistName);
  // const info = await SongstatsService.getTrackInfo(track.id);
  const info = mockTrackData;
  // const lyrics = await GeniusService.getLyricsByTrack(songName, artistName);
  const lyrics = {
    lyrics:
      "Esta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra. \nEsta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra. \nEsta es una letra de ejemplo para la canción. \nEsta es la segunda línea de la letra. \nEsta es la tercera línea de la letra.", // Valor mock
  };

  const cover = track.album?.images?.[0]?.url || "/default-cover.png";
  const durationMs = track.duration_ms ?? 0;
  const explicit = !!track.explicit;
  const albumRelease = track.album?.release_date ?? null;
  const bpm = info?.bpm ?? null;
  const key = info?.key ?? null;
  const genres = info?.genres ?? [];
  const collaborators = info?.collaborators ?? [];
  const label = info?.label ?? null;
  const distributor = info?.distributor ?? null;

  const translatedCollaborators = (
    collaborators as Array<{ name: string; roles: string[] }>
  )
    .map((c) => {
      // normaliza y traduce cada rol
      const translated = (c.roles || [])
        .flatMap((r) => {
          // admite roles con separadores raros: "Composer / Songwriter"
          return String(r)
            .split(/[\/,&|]/g)
            .map((s) => s.trim())
            .filter(Boolean);
        })
        .map(normalizeRole)
        .sort()
        .map(roleLabelEs)
        .filter((lbl): lbl is string => Boolean(lbl));

      // de-duplicar
      const unique = Array.from(new Set(translated));

      return { name: c.name, roles: unique };
    })
    // si alguien se queda sin roles tras filtrar, no lo muestres
    .filter((c) => c.roles.length > 0);

  const collaboratorsByRole = sortCollabs(translatedCollaborators);

  const breadcrumbItems = [
    { label: "ARTISTAS", href: "/artists" },
    {
      label: wrapWord(artistName).toUpperCase(),
      href: `/artists/${artistSlug}`,
    },
    {
      label: wrapWord(albumName).toUpperCase(),
      href: `/albums/${artistSlug}/${slugify(albumName)}`,
    },
    {
      label: wrapWord(track.name).toUpperCase(),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      {/* HERO con blur */}
      <Hero cover={cover} type="song" />

      <div className="relative -mt-12 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <CustomBreadcrumb items={breadcrumbItems} />
          <div className="grid grid-cols-12 gap-8 mt-4">
            {/* ASIDE: portada + CTAs (placeholders) */}
            <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 self-start space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight clamp-3">
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                <span>{msToMinSec(durationMs)}</span>
                <span aria-hidden>•</span>
                <time dateTime={albumRelease}>
                  {new Date(albumRelease).toLocaleDateString()}
                </time>
                {!!genres.length && (
                  <>
                    <span aria-hidden>•</span>
                    <span className="capitalize">{genres[0]}</span>
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
                  {!!genres.length && (
                    <p className="text-lg">
                      <span className="font-semibold">Género/s:</span>{" "}
                      <span className="capitalize">{genres.join(", ")}</span>
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
                    <div className="text-2xl font-bold">{bpm ?? "-"}</div>
                  </div>
                  <div
                    aria-label="Key"
                    className="min-w-16 rounded-xl bg-gray-100 px-3 py-2 text-center"
                  >
                    <div className="text-xs uppercase tracking-wide text-gray-600">
                      Key
                    </div>
                    <div className="text-2xl font-bold">{key ?? "-"}</div>
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
                  name={wrapWord(track.name)}
                  variant="card"
                />
              </section>

              {/* Letra */}
              <section aria-labelledby="lyrics-title">
                <h2 id="lyrics-title" className="mb-3 text-2xl font-semibold">
                  Letra
                </h2>
                <LyricsDisplayer lyrics={lyrics.lyrics} />
              </section>

              {/* Créditos */}
              <section aria-labelledby="collabs-title">
                <h2 id="collabs-title" className="mb-3 text-2xl font-semibold">
                  Créditos
                </h2>
                {collaboratorsByRole.length ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {collaboratorsByRole.map(({ role, names }) => (
                      <div
                        key={role}
                        className="rounded-xl border p-4 bg-white"
                      >
                        <h3 className="font-semibold mb-1">{role}</h3>
                        <p className="text-gray-700">{names.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No hay colaboradores disponibles.
                  </p>
                )}
              </section>

              <section aria-labelledby="label-title">
                <h2 id="label-title" className="mb-3 text-2xl font-semibold">
                  Fuente
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4 bg-white md:col-span-2">
                    <h3 className="font-semibold mb-2">
                      Discográfica / Distribuidora
                    </h3>
                    <p className="text-gray-700">
                      {label ?? ""}
                      {distributor ? ` · ${distributor}` : ""}
                    </p>
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
                      <p className="font-semibold truncate">
                        {track.album.name}
                      </p>
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
