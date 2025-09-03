import Link from "next/link";
import { User } from "lucide-react";

interface LoginButtonProps {
  onMobileMenuClose?: () => void;
}

export function LoginButton({ onMobileMenuClose }: LoginButtonProps) {
  return (
    <Link
      href="/login"
      onClick={onMobileMenuClose}
      className="inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-purple-700 transition"
    >
      <User className="h-4 w-4" />
      Acceder
    </Link>
  );
}
