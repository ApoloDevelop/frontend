import React from "react";
import { Music, User, Disc3 } from "lucide-react";
import { ItemType2 } from "@/types/items";

export const getTypeIcon = (type: ItemType2) => {
  switch (type) {
    case "artist":
      return <User className="w-4 h-4" />;
    case "album":
      return <Disc3 className="w-4 h-4" />;
    case "track":
      return <Music className="w-4 h-4" />;
  }
};

export const getTypeLabel = (type: ItemType2) => {
  switch (type) {
    case "artist":
      return "Artistas";
    case "album":
      return "Álbumes";
    case "track":
      return "Canciones";
  }
};
