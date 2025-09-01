import { deslugify } from "@/utils/normalization";

export function useArtistParams(slug: string) {
  const raw = deslugify(slug);
  const decoded = decodeURIComponent(raw);
  return decoded;
}
