import Image from "next/image";

interface ArticleHeroProps {
  imageUrl: string;
  title: string;
}

export function ArticleHero({ imageUrl, title }: ArticleHeroProps) {
  return (
    <div className="relative h-56 sm:h-72 md:h-80 w-full mb-6">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
