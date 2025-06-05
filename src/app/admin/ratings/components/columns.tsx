"use client"

import { Rating } from "@/schema/rating.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star, User, Package, Calendar, Link } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { format } from "date-fns";

// Stars display component
const RatingStars = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
        />
      ))}
      <span className="ml-2 text-sm font-medium">{value.toFixed(1)}</span>
    </div>
  );
};

interface ActionsProps {
  rating: Rating
  onViewDetails: (rating: Rating) => void,
  onDeleteRating: (rating: Rating) => void
}

const Actions = ({ rating, onViewDetails, onDeleteRating }: ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetails(rating)}>
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
              Delete comment
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is only for moderation. This will remove the rating comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteRating(rating)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function getRatingColumns(
  onViewDetails: (rating: Rating) => void,
  onDeleteRating: (rating: Rating) => void
): ColumnDef<Rating>[] {
  return [
    {
      accessorKey: "item_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item" />
      ),
      cell: ({ row }) => {
        const itemId = row.getValue("item_id") as number;
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`/admin/items/${itemId}`}
              className="flex items-center hover:underline text-primary"
            >
              Item #{itemId}
              <Link className="ml-1 h-3 w-3" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const userId = row.getValue("user_id") as number;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`/admin/users/${userId}`}
              className="flex items-center hover:underline text-primary"
            >
              User #{userId}
              <Link className="ml-1 h-3 w-3" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("value") as number;
        return <RatingStars value={value} />;
      },
    },
    {
      accessorKey: "comment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment" />
      ),
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string | null;
        return (
          <div className="max-w-[200px] truncate">
            {comment ?? <span className="text-muted-foreground italic">No comment</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(date), 'MMM d, yyyy')}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rating = row.original;
        return <Actions 
          rating={rating} 
          onViewDetails={onViewDetails} 
          onDeleteRating={onDeleteRating} 
        />;
      },
    },
  ];
}
