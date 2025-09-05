"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollTopOnRouteChange({
  behavior = "instant",
}: {
  behavior?: ScrollBehavior; // "auto" | "smooth" | "instant"
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Si navega con hash (#seccion), no fuerza al top
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, searchParams, behavior]);

  return null;
}
