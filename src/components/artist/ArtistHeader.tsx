import Image from "next/image";
import Rating from "@/components/reviews/Rating";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { PlatformLinks } from "@/components/artist/PlatformLinks";
import { ArtistDetails } from "@/types/musicbrainz";

interface ArtistHeaderProps {
  artistData: {
    images: Array<{ url: string }>;
    name: string;
  };
  details: ArtistDetails | null;
  item: { itemId: number } | null;
  authUser: { id: number } | null;
  links: Array<{ source: string; url: string }>;
}

export function ArtistHeader({
  artistData,
  details,
  item,
  authUser,
  links,
}: ArtistHeaderProps) {
  return (
    <div
      id="header"
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8"
    >
      <div className="relative -mt-14 sm:-mt-20 md:-mt-28 z-10">
        <Image
          src={artistData.images[0]?.url || "/default-cover.png"}
          alt={artistData.name}
          width={200}
          height={200}
          className="rounded-lg object-cover shadow-lg w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
        />
      </div>
      <div className="ml-0 sm:ml-6 mt-2 sm:mt-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-bold text-black">{artistData.name}</h1>
          </div>
          <div className="hidden sm:inline-block">
            <Rating
              name={artistData.name}
              type="artist"
              itemId={item?.itemId ?? null}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="text-lg text-gray-600">
            {details?.type === "Person"
              ? "Artista"
              : details?.type === "Group"
              ? "Grupo"
              : ""}
          </p>
          <PlatformLinks links={links} />
          <div className="sm:hidden">
            <Rating
              name={artistData.name}
              type="artist"
              itemId={item?.itemId ?? null}
            />
          </div>
        </div>
      </div>

      <div className="ml-0 sm:ml-auto mt-3 sm:mt-2 flex flex-wrap items-center gap-2">
        {authUser && (
          <>
            <FavoriteButton
              type="artist"
              name={artistData.name}
              userId={authUser.id}
            />
            <AddToListDialog
              userId={authUser.id}
              itemType="artist"
              name={artistData.name}
            />
          </>
        )}
      </div>
    </div>
  );
}
