export function normalize(v: any) {
  v === undefined || v === null || v === "" ? null : v;
  return v;
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s,'-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
