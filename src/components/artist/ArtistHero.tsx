import Image from "next/image";

interface ArtistHeroProps {
  artistData: {
    images: Array<{ url: string }>;
    name: string;
  };
}

export function ArtistHero({ artistData }: ArtistHeroProps) {
  return (
    <div
      id="hero"
      className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full mb-6"
    >
      <Image
        src={artistData.images[0]?.url || "/default-cover.png"}
        alt={artistData.name}
        fill
        className="object-cover blur-sm"
        priority
      />
    </div>
  );
}
