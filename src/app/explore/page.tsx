"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpotifyService } from "@/services/spotify.service";
import { slugify } from "@/utils/normalization";
import SearchGrid from "@/components/explore/SearchGrid";

// Helpers de URL robustos (sin perder guiones ni acentos)

type Kind = "artist" | "album" | "track";

type PageRes<T> = {
  href?: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

// Debounce simple
function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

// UI de cada pestaña
function Results({ type, q }: { type: Kind; q: string }) {
  const debounced = useDebounced(q);
  const [data, setData] = useState<PageRes<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [debounced, type]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!debounced.trim()) {
        setData(null);
        return;
      }
      setLoading(true);
      const res = await SpotifyService.search(debounced, type, {
        limit: 12,
        offset,
      });
      if (!cancelled) {
        setData(res);
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced, type, offset]);

  const items = data?.items ?? [];

  return (
    <SearchGrid
      items={items}
      type={type}
      data={data}
      loading={loading}
      setOffset={setOffset}
    />
  );
}

export default function ExplorePage() {
  const [qArtist, setQArtist] = useState("");
  const [qAlbum, setQAlbum] = useState("");
  const [qTrack, setQTrack] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Explorar</h1>

      <Tabs defaultValue="artist" className="w-full">
        <TabsList>
          <TabsTrigger value="artist">Artistas</TabsTrigger>
          <TabsTrigger value="album">Álbumes</TabsTrigger>
          <TabsTrigger value="track">Canciones</TabsTrigger>
        </TabsList>

        <TabsContent value="artist" className="mt-4 space-y-4">
          <Input
            value={qArtist}
            onChange={(e) => setQArtist(e.target.value)}
            placeholder="Buscar artistas"
          />
          <Results type="artist" q={qArtist} />
        </TabsContent>

        <TabsContent value="album" className="mt-4 space-y-4">
          <Input
            value={qAlbum}
            onChange={(e) => setQAlbum(e.target.value)}
            placeholder="Buscar álbumes"
          />
          <Results type="album" q={qAlbum} />
        </TabsContent>

        <TabsContent value="track" className="mt-4 space-y-4">
          <Input
            value={qTrack}
            onChange={(e) => setQTrack(e.target.value)}
            placeholder="Buscar canciones"
          />
          <Results type="track" q={qTrack} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
