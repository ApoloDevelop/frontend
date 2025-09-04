import { TagDraft } from "./article";
import { ItemType, ItemType2 } from "./items";

export type AddToListDialogProps = {
  userId: number;
  itemType: ItemType;
  name: string;
  artistName?: string;
  location?: string;
  height?: number;
  className?: string;
};

export type ListItem = {
  itemId: number;
  item: {
    id: number;
    name: string;
    artistName?: string;
    albumName?: string;
  };
};

export type ListDetail = {
  id: number;
  name: string;
  itemType: ItemType2;
  createdAt: string;
  listItems: ListItem[];
};

export type ListTagPickerProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (t: TagDraft) => void;
  itemType: ItemType2;
  disabled?: boolean;
};

export type TabType = ItemType2 | "favorites";

export type List = {
  id: number;
  name: string;
  itemType?: ItemType2;
  createdAt?: string;
  listItems?: Array<{ itemId: number }>;
};

export type FavoriteItem = {
  itemId: number;
  type: ItemType2;
  item: {
    id: number;
    name: string;
    artistName?: string;
    albumName?: string;
  };
};
