import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Disc3, Music, Heart } from "lucide-react";
import { TabType } from "@/types/lists";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (value: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const getTabIcon = (type: TabType) => {
    switch (type) {
      case "artist":
        return <User className="w-4 h-4" />;
      case "album":
        return <Disc3 className="w-4 h-4" />;
      case "track":
        return <Music className="w-4 h-4" />;
      case "favorites":
        return <Heart className="w-4 h-4" />;
    }
  };

  const getTabLabel = (type: TabType) => {
    switch (type) {
      case "artist":
        return "Artistas";
      case "album":
        return "Álbumes";
      case "track":
        return "Canciones";
      case "favorites":
        return "Favoritos";
    }
  };

  return (
    <TabsList className="grid w-full grid-cols-4 h-auto min-h-[40px] sm:min-h-[44px]">
      {(["artist", "album", "track", "favorites"] as TabType[]).map((type) => (
        <TabsTrigger
          key={type}
          value={type}
          className="flex flex-col items-center justify-center gap-1 px-1 py-2 text-xs sm:flex-row sm:gap-2 sm:px-3 sm:text-sm min-w-0"
        >
          <div className="flex-shrink-0">{getTabIcon(type)}</div>
          <span className="truncate max-w-full leading-tight sm:leading-normal">
            {getTabLabel(type)}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
