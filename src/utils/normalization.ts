export function normalize(v: any) {
  v === undefined || v === null || v === "" ? null : v;
  return v;
}

export function slugify(s: string) {
  const dashed = s.trim().replace(/[–—]/g, "-").replace(/\s+/g, "-");
  return encodeURIComponent(dashed.toLowerCase());
}

export const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export function deslugify(slug: string) {
  let decoded = safeDecode(slug);
  if (/%[0-9A-Fa-f]{2}/.test(decoded)) decoded = safeDecode(decoded);

  const SENTINEL = "\uE000";
  return decoded
    .replace(/---/g, SENTINEL)
    .replace(/-/g, " ")
    .replace(new RegExp(SENTINEL, "g"), " - ");
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
