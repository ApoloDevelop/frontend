// helpers/distances.ts
export type LatLng = { lat: number; lng: number };

export function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function pickNearest<T extends { lat: number; lng: number }>(
  origin: LatLng,
  candidates: T[]
): { item: T; distanceKm: number } | null {
  if (!candidates.length) return null;
  let best = candidates[0];
  let bestD = haversineKm(origin, candidates[0]);
  for (let i = 1; i < candidates.length; i++) {
    const d = haversineKm(origin, candidates[i]);
    if (d < bestD) {
      bestD = d;
      best = candidates[i];
    }
  }
  return { item: best, distanceKm: bestD };
}
