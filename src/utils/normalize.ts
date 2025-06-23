export function normalize(v: any) {
  v === undefined || v === null || v === "" ? null : v;
  return v;
}
