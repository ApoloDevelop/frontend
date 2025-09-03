import Link from "next/link";

interface BrandLogoProps {
  onMobileMenuClose?: () => void;
}

export function BrandLogo({ onMobileMenuClose }: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onMobileMenuClose}
      className="block font-extrabold text-xl sm:text-2xl tracking-tight"
      aria-label="Apolo - Inicio"
    >
      Apolo
    </Link>
  );
}
