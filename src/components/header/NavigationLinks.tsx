import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/news", label: "Noticias" },
  { href: "/explore", label: "Explorar" },
];

interface NavigationLinksProps {
  isActive: (href: string) => boolean;
  onItemClick?: () => void;
  isMobile?: boolean;
}

export function NavigationLinks({
  isActive,
  onItemClick,
  isMobile = false,
}: NavigationLinksProps) {
  if (isMobile) {
    return (
      <nav className="px-2 py-2">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onItemClick}
            className={`block rounded-md px-3 py-2 text-base font-medium transition ${
              isActive(l.href)
                ? "bg-gray-100 text-black"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex justify-center gap-6 justify-self-center">
      {navLinks.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm font-medium transition hover:opacity-90 ${
            isActive(l.href) ? "text-black" : "text-gray-600"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
