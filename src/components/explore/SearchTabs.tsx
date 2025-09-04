import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kind } from "@/hooks/explore/useSearch";
import { TabKind } from "@/hooks/explore/useTabSearch";
import SearchTab from "./SearchTab";
import ArtistSearchTab from "./ArtistSearchTab";
import UserSearchTab from "./UserSearchTab";

interface SearchTabsProps {
  queries: {
    artist: string;
    album: string;
    track: string;
    user: string;
  };
  onQueryChange: (type: TabKind, value: string) => void;
  defaultValue?: TabKind;
}

const tabsConfig = [
  { value: "artist" as TabKind, label: "Artistas" },
  { value: "album" as TabKind, label: "Álbumes" },
  { value: "track" as TabKind, label: "Canciones" },
  { value: "user" as TabKind, label: "Usuarios" },
];

export default function SearchTabs({
  queries,
  onQueryChange,
  defaultValue = "artist",
}: SearchTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList>
        {tabsConfig.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabsConfig.map(({ value }) => {
        if (value === "user") {
          return (
            <UserSearchTab
              key={value}
              value={queries[value]}
              onValueChange={(newValue) => onQueryChange(value, newValue)}
            />
          );
        }

        if (value === "artist") {
          return (
            <ArtistSearchTab
              key={value}
              value={queries[value]}
              onValueChange={(newValue) => onQueryChange(value, newValue)}
            />
          );
        }

        return (
          <SearchTab
            key={value}
            type={value as Kind}
            value={queries[value]}
            onValueChange={(newValue) => onQueryChange(value, newValue)}
          />
        );
      })}
    </Tabs>
  );
}
