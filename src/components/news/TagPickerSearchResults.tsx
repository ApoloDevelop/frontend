// src/components/news/TagPickerSearchResults.tsx
"use client";

import Image from "next/image";
import { TagDraft } from "@/types/article";

interface TagPickerSearchResultsProps {
  loading: boolean;
  artists: any[];
  albums: any[];
  tracks: any[];
  q: string;
  onAdd: (tag: TagDraft) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function TagPickerSearchResults({
  loading,
  artists,
  albums,
  tracks,
  q,
  onAdd,
  onClose,
  disabled = false,
}: TagPickerSearchResultsProps) {
  const hasMinQuery = q.trim().length >= 2;
  const hasNoResults =
    !loading &&
    hasMinQuery &&
    artists.length === 0 &&
    albums.length === 0 &&
    tracks.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 p-3 overflow-auto">
      {/* Artistas */}
      <div className="md:border-r md:pr-3">
        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
          Artistas
        </h4>
        {loading && <p className="text-sm text-gray-500">Buscando…</p>}
        {!loading && artists.length === 0 && hasMinQuery && (
          <p className="text-sm text-gray-500">Sin resultados</p>
        )}
        <ul className="space-y-2">
          {artists.map((artist) => (
            <ArtistItem
              key={artist.id}
              artist={artist}
              onAdd={onAdd}
              onClose={onClose}
              disabled={disabled}
            />
          ))}
        </ul>
      </div>

      {/* Álbumes */}
      <div className="md:border-r md:px-3">
        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
          Álbumes
        </h4>
        {loading && <p className="text-sm text-gray-500">Buscando…</p>}
        {!loading && albums.length === 0 && hasMinQuery && (
          <p className="text-sm text-gray-500">Sin resultados</p>
        )}
        <ul className="space-y-2">
          {albums.map((album) => (
            <AlbumItem
              key={album.id}
              album={album}
              onAdd={onAdd}
              onClose={onClose}
              disabled={disabled}
            />
          ))}
        </ul>
      </div>

      {/* Canciones */}
      <div className="md:pl-3">
        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
          Canciones
        </h4>
        {loading && <p className="text-sm text-gray-500">Buscando…</p>}
        {!loading && tracks.length === 0 && hasMinQuery && (
          <p className="text-sm text-gray-500">Sin resultados</p>
        )}
        <ul className="space-y-2">
          {tracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              onAdd={onAdd}
              onClose={onClose}
              disabled={disabled}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

// Componentes auxiliares para cada tipo de resultado
function ArtistItem({
  artist,
  onAdd,
  onClose,
  disabled = false,
}: {
  artist: any;
  onAdd: (tag: TagDraft) => void;
  onClose: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
        onClick={() => {
          onAdd({ type: "artist", name: artist.name });
          onClose();
        }}
      >
        <Image
          src={artist.images?.[0]?.url || "/default-cover.png"}
          alt=""
          width={40}
          height={40}
          className="rounded object-cover"
        />
        <div>
          <div className="font-medium">{artist.name}</div>
          <div className="text-xs text-gray-500">Artista</div>
        </div>
      </button>
    </li>
  );
}

function AlbumItem({
  album,
  onAdd,
  onClose,
  disabled = false,
}: {
  album: any;
  onAdd: (tag: TagDraft) => void;
  onClose: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
        onClick={() => {
          const mainArtist = album.artists?.[0]?.name ?? "";
          onAdd({
            type: "album",
            name: album.name,
            artistName: mainArtist,
          });
          onClose();
        }}
      >
        <Image
          src={album.images?.[0]?.url || "/default-cover.png"}
          alt=""
          width={40}
          height={40}
          className="rounded object-cover"
        />
        <div className="min-w-0">
          <div className="font-medium truncate">{album.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {(album.artists ?? []).map((x: any) => x.name).join(", ")}
          </div>
        </div>
      </button>
    </li>
  );
}

function TrackItem({
  track,
  onAdd,
  onClose,
  disabled = false,
}: {
  track: any;
  onAdd: (tag: TagDraft) => void;
  onClose: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-black/5 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
        onClick={() => {
          const mainArtist = track.artists?.[0]?.name ?? "";
          onAdd({
            type: "track",
            name: track.name,
            artistName: mainArtist,
            albumName: track.album?.name ?? undefined,
          });
          onClose();
        }}
      >
        <Image
          src={track.album?.images?.[0]?.url || "/default-cover.png"}
          alt=""
          width={40}
          height={40}
          className="rounded object-cover"
        />
        <div className="min-w-0">
          <div className="font-medium truncate">{track.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {(track.artists ?? []).map((x: any) => x.name).join(", ")}
            {track.album?.name ? ` • ${track.album.name}` : ""}
          </div>
        </div>
      </button>
    </li>
  );
}
