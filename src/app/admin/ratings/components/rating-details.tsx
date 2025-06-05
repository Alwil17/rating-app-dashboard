"use client"

import { Rating } from "@/schema/rating.schema";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Star, User, Package, Calendar, MessageSquare } from "lucide-react";

type RatingDetailsProps = {
  rating: Rating | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RatingDetails({ rating, open, onOpenChange }: Readonly<RatingDetailsProps>) {
  if (!rating) return null;

  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rating Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[25%_75%] items-start gap-4">
            <div className="font-medium">Rating</div>
            <div>
              {renderStars(rating.value)}
              <span className="ml-2">{rating.value.toFixed(1)}</span>
            </div>
          </div>

          {rating.comment && (
            <div className="grid grid-cols-[25%_75%] items-start gap-4">
              <div className="flex items-center gap-2 font-medium">
                <MessageSquare className="h-4 w-4" />
                Comment
              </div>
              <div>{rating.comment}</div>
            </div>
          )}
          
          <div className="grid grid-cols-[25%_75%] items-start gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Package className="h-4 w-4" />
              Item
            </div>
            <div>#{rating.item_id}</div>
          </div>
          
          <div className="grid grid-cols-[25%_75%] items-start gap-4">
            <div className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              User
            </div>
            <div>#{rating.user_id}</div>
          </div>
          
          <div className="grid grid-cols-[25%_75%] items-start gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Created
            </div>
            <div>{format(new Date(rating.created_at), 'PPP p')}</div>
          </div>
          
          <div className="grid grid-cols-[25%_75%] items-start gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Updated
            </div>
            <div>{format(new Date(rating.updated_at), 'PPP p')}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
