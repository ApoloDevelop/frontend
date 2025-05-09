"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  return (
    <header className="p-4">
      <h1
        className={`text-2xl font-bold ${
          isRegisterPage ? "text-white" : "text-black"
        }`}
      >
        Apolo
      </h1>
    </header>
  );
}
