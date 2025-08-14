export function normalize(v: any) {
  v === undefined || v === null || v === "" ? null : v;
  return v;
}

export function slugify(s: string) {
  const dashed = s
    .trim()
    .replace(/[–—]/g, "-") // guiones raros → '-'
    .replace(/\s+/g, "-"); // espacios → '-'
  return encodeURIComponent(dashed.toLowerCase());
}

export function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function wrapWord(s: string) {
  return s.length > 60 ? s.slice(0, 57).trim() + "…" : s;
}
