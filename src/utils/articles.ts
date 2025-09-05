import { TagDraft } from "@/types/article";

export function toPayloadTags(tags: TagDraft[]) {
  return tags.map(({ type, name, artistName, albumName }) => ({
    type,
    name,
    ...(artistName ? { artistName } : {}),
    ...(albumName ? { albumName } : {}),
  }));
}
