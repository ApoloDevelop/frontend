"use client";

import { TagPickerHeader } from "../news/TagPickerHeader";
import { TagPickerSearchResults } from "../news/TagPickerSearchResults";
import { useTagPickerSearch } from "@/hooks/news/useTagPickerSearch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ListTagPickerProps } from "@/types/lists";

export function ListTagPicker({
  open,
  onClose,
  onAdd,
  itemType,
  disabled = false,
}: ListTagPickerProps) {
  const { q, setQ, loading, artists, albums, tracks, inputRef } =
    useTagPickerSearch(open);

  // Filtrar resultados según el tipo de lista
  const getFilteredResults = () => {
    switch (itemType) {
      case "artist":
        return { artists, albums: [], tracks: [] };
      case "album":
        return { artists: [], albums, tracks: [] };
      case "track":
        return { artists: [], albums: [], tracks };
      default:
        return { artists, albums, tracks };
    }
  };

  const {
    artists: filteredArtists,
    albums: filteredAlbums,
    tracks: filteredTracks,
  } = getFilteredResults();

  const getPlaceholderText = () => {
    switch (itemType) {
      case "artist":
        return "Buscar artista...";
      case "album":
        return "Buscar álbum...";
      case "track":
        return "Buscar canción...";
      default:
        return "Buscar...";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[900px] max-h-[85vh] overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{getPlaceholderText()}</DialogTitle>
        <TagPickerHeader
          q={q}
          setQ={setQ}
          inputRef={inputRef}
          onClose={onClose}
        />
        <TagPickerSearchResults
          loading={loading}
          artists={filteredArtists}
          albums={filteredAlbums}
          tracks={filteredTracks}
          q={q}
          onAdd={onAdd}
          onClose={onClose}
          disabled={disabled}
        />
      </DialogContent>
    </Dialog>
  );
}
