import { TabsContent } from "@/components/ui/tabs";
import SearchInput from "./SearchInput";
import UserSearchResults from "./UserSearchResults";

interface UserSearchTabProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function UserSearchTab({
  value,
  onValueChange,
}: UserSearchTabProps) {
  return (
    <TabsContent value="user" className="mt-4 space-y-4">
      <SearchInput value={value} onChange={onValueChange} type="user" />
      <UserSearchResults query={value} />
    </TabsContent>
  );
}
