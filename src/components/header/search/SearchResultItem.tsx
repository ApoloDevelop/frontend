import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/normalization";

interface SearchResultItemProps {
  item: any;
  type: "artist" | "album" | "track" | "user";
  onItemClick: () => void;
}

export function SearchResultItem({
  item,
  type,
  onItemClick,
}: SearchResultItemProps) {
  const getItemLink = () => {
    switch (type) {
      case "artist":
        return `/artists/${slugify(item.name)}`;
      case "album":
        return `/albums/${slugify(item.artists?.[0]?.name ?? "")}/${slugify(
          item.name
        )}`;
      case "track":
        return `/songs/${slugify(item.artists?.[0]?.name ?? "")}/${slugify(
          item.album?.name ?? ""
        )}/${slugify(item.name)}`;
      case "user":
        return `/users/${item.username}`;
      default:
        return "#";
    }
  };

  const getItemImage = () => {
    switch (type) {
      case "artist":
      case "album":
        return item.images?.[0]?.url || "/default-cover.png";
      case "track":
        return item.album?.images?.[0]?.url || "/default-cover.png";
      case "user":
        return item.profile_pic || "/default-cover.png";
      default:
        return "/default-cover.png";
    }
  };

  const getItemTitle = () => {
    switch (type) {
      case "user":
        return `@${item.username}`;
      default:
        return item.name;
    }
  };

  const getItemSubtitle = () => {
    switch (type) {
      case "album":
        return (item.artists ?? []).map((x: any) => x.name).join(", ");
      case "track":
        return `${(item.artists ?? []).map((x: any) => x.name).join(", ")} • ${
          item.album?.name
        }`;
      case "user":
        return item.fullname;
      default:
        return null;
    }
  };

  return (
    <li>
      <Link
        href={getItemLink()}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5"
        onClick={onItemClick}
      >
        <Image
          src={getItemImage()}
          alt=""
          width={32}
          height={32}
          className={`rounded object-cover ${
            type === "user" ? "rounded-full" : ""
          }`}
        />
        <div className="min-w-0">
          <div className={`truncate ${type === "user" ? "font-medium" : ""}`}>
            {getItemTitle()}
          </div>
          {getItemSubtitle() && (
            <div className="text-xs text-gray-500 truncate">
              {getItemSubtitle()}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
