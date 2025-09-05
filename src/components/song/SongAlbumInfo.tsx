import Link from "next/link";
import Image from "next/image";

interface Album {
  name: string;
  artists: Array<{ name: string }>;
}

interface SongAlbumInfoProps {
  album: Album;
  cover: string;
  artistSlug: string;
  albumSlug: string;
}

export function SongAlbumInfo({
  album,
  cover,
  artistSlug,
  albumSlug,
}: SongAlbumInfoProps) {
  if (!album) return null;

  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold">En el álbum</h2>
      <Link
        href={`/albums/${artistSlug}/${albumSlug}`}
        className="group inline-flex items-center gap-4 rounded-xl border p-3 pr-5 bg-white hover:bg-black/5 transition"
        scroll
      >
        <Image
          src={cover}
          alt={album.name}
          width={64}
          height={64}
          className="rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="font-semibold truncate">{album.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {album.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </Link>
    </section>
  );
}
