import Link from "next/link";
import { FaSpotify, FaYoutube, FaInstagram } from "react-icons/fa";

interface PlatformLink {
  source: string;
  url: string;
}

interface PlatformLinksProps {
  links: PlatformLink[];
}

export function PlatformLinks({ links }: PlatformLinksProps) {
  const getIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "spotify":
        return (
          <FaSpotify
            className="text-green-600 hover:scale-110 transition mr-2"
            size={20}
          />
        );
      case "youtube":
        return (
          <FaYoutube
            className="text-red-600 hover:scale-110 transition mr-2"
            size={20}
          />
        );
      case "instagram":
        return (
          <FaInstagram
            className="text-pink-500 hover:scale-110 transition"
            size={20}
          />
        );
      default:
        return null;
    }
  };

  const prioritizedSources = ["spotify", "youtube", "instagram"];

  const orderedLinks = prioritizedSources
    .map((source) => links.find((link) => link.source.toLowerCase() === source))
    .filter(Boolean) as PlatformLink[];

  return (
    <div className="flex items-center gap-1">
      {orderedLinks.map((link, index) => {
        const icon = getIcon(link.source);
        if (!icon) return null;

        return (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10"
            title={link.source.charAt(0).toUpperCase() + link.source.slice(1)}
          >
            {icon}
          </Link>
        );
      })}
    </div>
  );
}
