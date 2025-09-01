import Image from "next/image";
import Rating from "@/components/reviews/Rating";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { AddToListDialog } from "@/components/lists/AddToListDialog";
import { ArtistDetails } from "@/utils/musicbrainz";

interface ArtistHeaderProps {
  artistData: {
    images: Array<{ url: string }>;
    name: string;
  };
  details: ArtistDetails | null;
  item: { itemId: number } | null;
  authUser: { id: number } | null;
}

export function ArtistHeader({
  artistData,
  details,
  item,
  authUser,
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
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-5xl font-bold text-black">{artistData.name}</h1>
          <div className="inline-block mt-2">
            <Rating
              name={artistData.name}
              type="artist"
              itemId={item?.itemId ?? null}
            />
          </div>
        </div>
        <p className="text-lg text-gray-600">
          {details?.type === "Person"
            ? "Artista"
            : details?.type === "Group"
            ? "Grupo"
            : ""}
        </p>
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
