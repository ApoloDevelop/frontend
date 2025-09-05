import Image from "next/image";

interface HeroProps {
  cover: string;
  type?: "album" | "artist" | "song";
}

export function Hero({ cover, type }: HeroProps) {
  const heightClass = type === "song" ? "h-50" : "h-72";
  return (
    <div className={`relative ${heightClass} mb-18 w-full overflow-hidden`}>
      <Image
        src={cover}
        alt=""
        fill
        priority
        className="object-cover scale-110 blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}
