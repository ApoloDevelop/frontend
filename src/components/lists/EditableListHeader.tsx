import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";

interface EditableListHeaderProps {
  name: string;
  editingName: boolean;
  newName: string;
  setNewName: (name: string) => void;
  setEditingName: (editing: boolean) => void;
  onUpdateName: () => void;
  onCancelEdit: () => void;
}

export function EditableListHeader({
  name,
  editingName,
  newName,
  setNewName,
  setEditingName,
  onUpdateName,
  onCancelEdit,
}: EditableListHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onUpdateName();
    }
    if (e.key === "Escape") {
      onCancelEdit();
    }
  };

  if (editingName) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="text-xl font-bold"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <Button size="sm" onClick={onUpdateName}>
          <Check className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancelEdit}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold">{name}</h2>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setEditingName(true)}
      >
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
