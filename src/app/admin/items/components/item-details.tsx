"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemResponse } from "@/schema/item.schema";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

type ItemDetailsProps = {
  item: ItemResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ItemDetails({ item, open, onOpenChange }: Readonly<ItemDetailsProps>) {
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('items.details.title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={item.image_url || undefined} />
              <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{item.avg_rating.toFixed(1)}</span>
                </div>
                <span>({item.count_rating} {t('items.details.ratings')})</span>
              </div>
            </div>
          </div>

          {item.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('items.details.description')}</h3>
              <p>{item.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{t('items.details.categories')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.categories && item.categories.length > 0 ? (
                  item.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t('items.details.noCategories')}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{t('items.details.tags')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags && item.tags.length > 0 ? (
                  item.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t('items.details.noTags')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{t('items.details.created')}</h3>
              </div>
              <p>{format(new Date(item.created_at), 'PPP')}</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">{t('items.details.lastUpdated')}</h3>
              </div>
              <p>{format(new Date(item.updated_at), 'PPP')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
