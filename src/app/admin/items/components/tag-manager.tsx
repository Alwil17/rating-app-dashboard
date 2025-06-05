"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { ItemResponse } from "@/schema/item.schema";
import { useUpdateItemTagsMutation } from "@/hooks/queries/use-item.query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type TagManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemResponse | null;
  onSuccess?: () => void;
};

export function TagManager({
  open,
  onOpenChange,
  item,
  onSuccess,
}: Readonly<TagManagerProps>) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const updateMutation = useUpdateItemTagsMutation(item?.id || 0);

  useEffect(() => {
    if (item && open) {
      setTags(item.tags.map((tag) => tag.name));
    }
  }, [item, open]);

  const addTag = () => {
    if (!inputValue.trim()) return;
    
    // Convert to lowercase and ensure no duplicates
    const normalizedTag = inputValue.trim().toLowerCase();
    if (!tags.some(tag => tag.toLowerCase() === normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    if (item) {
      updateMutation.mutate(tags, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Tags for {item?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add tag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={addTag}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[100px] p-2 border rounded-md">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-xs"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-center text-muted-foreground w-full my-auto">
                No tags added
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
