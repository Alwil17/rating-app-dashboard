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
import { Loader2 } from "lucide-react";
import { ItemResponse } from "@/schema/item.schema";
import { useUpdateItemCategoriesMutation } from "@/hooks/queries/use-item.query";
import { useCategories } from "@/hooks/queries/use-category.query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/schema/category.schema";

type CategoryManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemResponse | null;
  onSuccess?: () => void;
};

export function CategoryManager({
  open,
  onOpenChange,
  item,
  onSuccess,
}: CategoryManagerProps) {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const updateMutation = useUpdateItemCategoriesMutation(item?.id || 0);

  useEffect(() => {
    if (item && open) {
      setSelectedCategories(item.categories.map((cat) => cat.id));
    }
  }, [item, open]);

  const handleToggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = () => {
    if (item) {
      updateMutation.mutate(selectedCategories, {
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
          <DialogTitle>Manage Categories for {item?.name}</DialogTitle>
        </DialogHeader>
        {loadingCategories ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {categories && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleToggleCategory(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="flex-1">
                      {category.name}
                      {category.description && (
                        <span className="text-sm text-muted-foreground block">
                          {category.description}
                        </span>
                      )}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No categories available
                </p>
              )}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loadingCategories || updateMutation.isPending}
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
