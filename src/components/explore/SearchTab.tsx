import { TabsContent } from "@/components/ui/tabs";
import { Kind } from "@/hooks/explore/useSearch";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

interface SearchTabProps {
  type: Kind;
  value: string;
  onValueChange: (value: string) => void;
}

export default function SearchTab({
  type,
  value,
  onValueChange,
}: SearchTabProps) {
  return (
    <TabsContent value={type} className="mt-4 space-y-4">
      <SearchInput value={value} onChange={onValueChange} type={type} />
      <SearchResults query={value} type={type} />
    </TabsContent>
  );
}
