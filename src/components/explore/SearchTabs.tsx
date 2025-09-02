import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kind } from "@/hooks/explore/useSearch";
import SearchTab from "./SearchTab";

interface SearchTabsProps {
  queries: {
    artist: string;
    album: string;
    track: string;
  };
  onQueryChange: (type: Kind, value: string) => void;
  defaultValue?: Kind;
}

const tabsConfig = [
  { value: "artist" as Kind, label: "Artistas" },
  { value: "album" as Kind, label: "Álbumes" },
  { value: "track" as Kind, label: "Canciones" },
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

      {tabsConfig.map(({ value }) => (
        <SearchTab
          key={value}
          type={value}
          value={queries[value]}
          onValueChange={(newValue) => onQueryChange(value, newValue)}
        />
      ))}
    </Tabs>
  );
}
