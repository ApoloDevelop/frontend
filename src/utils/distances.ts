// helpers/distances.ts
export type LatLng = { lat: number; lng: number };

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371; // km
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
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
