"use client"

import { ItemResponse } from "@/schema/item.schema"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActionsProps {
    item: ItemResponse
    onViewDetails: (item: ItemResponse) => void
    onEditItem: (item: ItemResponse) => void
    onDeleteItem: (itemId: number) => void
    onManageCategories: (item: ItemResponse) => void
    onManageTags: (item: ItemResponse) => void
}

const Actions = ({
    item,
    onViewDetails,
    onEditItem,
    onDeleteItem,
    onManageCategories,
    onManageTags,
}: ActionsProps) => {
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
                <DropdownMenuItem onClick={() => onViewDetails(item)}>
                    View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditItem(item)}>
                    Edit item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageCategories(item)}>
                    Manage categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageTags(item)}>
                    Manage tags
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive"
                        >
                            Delete item
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                the item and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteItem(item.id)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function getItemColumns(
    onViewDetails: (item: ItemResponse) => void,
    onEditItem: (item: ItemResponse) => void,
    onDeleteItem: (itemId: number) => void,
    onManageCategories: (item: ItemResponse) => void,
    onManageTags: (item: ItemResponse) => void
): ColumnDef<ItemResponse>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={item.image_url || undefined}
                                alt={item.name}
                            />
                            <AvatarFallback>
                                {item.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{item.name}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "categories",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Categories" />
            ),
            cell: ({ row }) => {
                const categories = row.getValue("categories") as ItemResponse["categories"]
                return (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {categories.length > 0 ? (
                            categories.slice(0, 3).map((category) => (
                                <Badge key={category.id} variant="outline">
                                    {category.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                        )}
                        {categories.length > 3 && (
                            <Badge variant="outline">+{categories.length - 3} more</Badge>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "avg_rating",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Rating" />
            ),
            cell: ({ row }) => {
                const rating = row.getValue("avg_rating") as number
                const count = row.original.count_rating
                return (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({count})</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => {
                return new Date(row.getValue("created_at")).toLocaleDateString()
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <Actions
                        item={item}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onDeleteItem={onDeleteItem}
                        onManageCategories={onManageCategories}
                        onManageTags={onManageTags}
                    />
                )
            },
        },
    ]
}
