import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { isAuthenticated } from "@/lib/auth";

function sanitizeNext(n: string | null): string {
  if (!n) return "/";
  try {
    const decoded = decodeURIComponent(n);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
    if (decoded.startsWith("/login")) return "/";
    return decoded;
  } catch {
    return "/";
  }
}

function withNext(base: string | undefined, next: string | null) {
  if (!base) return undefined;
  const url = new URL(base);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

interface UseLoginNavigationReturn {
  nextRaw: string | null;
  nextSafe: string;
  oauthError: boolean;
  googleUrl: string | undefined;
  spotifyUrl: string | undefined;
  redirectToNext: (url: string) => void;
  getRegisterUrl: () => string;
}

export const useLoginNavigation = (): UseLoginNavigationReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const nextSafe = useMemo(() => sanitizeNext(nextRaw), [nextRaw]);
  const oauthError = searchParams.get("oauth") === "error";

  const OAUTH_GOOGLE = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL;
  const OAUTH_SPOTIFY = process.env.NEXT_PUBLIC_OAUTH_SPOTIFY_URL;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(nextSafe);
    }
  }, [router, nextSafe]);

  // Handle OAuth error
  useEffect(() => {
    if (oauthError) {
      // Clear error from URL while keeping next parameter
      router.replace(
        nextRaw ? `/login?next=${encodeURIComponent(nextRaw)}` : "/login"
      );
    }
  }, [oauthError, router, nextRaw]);

  const redirectToNext = (url: string) => {
    window.location.href = url;
  };

  const getRegisterUrl = () => {
    return nextRaw
      ? `/register?next=${encodeURIComponent(nextRaw)}`
      : "/register";
  };

  return {
    nextRaw,
    nextSafe,
    oauthError,
    googleUrl: withNext(OAUTH_GOOGLE, nextRaw),
    spotifyUrl: withNext(OAUTH_SPOTIFY, nextRaw),
    redirectToNext,
    getRegisterUrl,
  };
};
