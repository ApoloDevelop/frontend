import Image from "next/image";

interface ArtistHeroProps {
  artistName: string;
  imageUrl?: string;
  className?: string;
}

export default function ArtistHero({
  artistName,
  imageUrl,
  className = "h-48 sm:h-64 md:h-72 lg:h-80",
}: ArtistHeroProps) {
  return (
    <div id="hero" className={`relative w-full mb-6 ${className}`}>
      <Image
        src={imageUrl || "/default-cover.png"}
        alt={artistName}
        fill
        className="object-cover blur-sm"
        priority
      />
    </div>
  );
}
