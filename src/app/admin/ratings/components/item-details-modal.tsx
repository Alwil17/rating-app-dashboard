import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface ItemDetailsModalProps {
  itemId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailsModal({ itemId, open, onOpenChange }: Readonly<ItemDetailsModalProps>) {
  const { data: item, isLoading } = useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const response = await api.get(`/items/${itemId}`);
      return response.data;
    },
    enabled: !!itemId && open,
  });

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  } else if (item) {
    content = (
      <div className="grid gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={item.image_url ?? undefined} alt={item.name} />
            <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{item.avg_rating.toFixed(1)}</span>
              </div>
              <span>({item.count_rating} ratings)</span>
            </div>
          </div>
        </div>

        {item.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p>{item.description}</p>
          </div>
        )}

        {item.categories && item.categories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {item.categories.map((category: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <Badge key={category.id} variant="outline">{category.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
            <p>{format(new Date(item.created_at), 'PPP')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
            <p>{format(new Date(item.updated_at), 'PPP')}</p>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="text-center py-8 text-muted-foreground">
        Item not found
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
