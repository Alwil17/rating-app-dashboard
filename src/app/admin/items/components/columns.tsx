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
    t?: (key: string, options?: any) => string // Add translation function
}

const Actions = ({
    item,
    onViewDetails,
    onEditItem,
    onDeleteItem,
    onManageCategories,
    onManageTags,
    t = (key: string) => key, // Default implementation if not provided
}: ActionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t('common.openMenu')}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onViewDetails(item)}>
                    {t('items.actions.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditItem(item)}>
                    {t('items.actions.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageCategories(item)}>
                    {t('items.actions.manageCategories')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageTags(item)}>
                    {t('items.actions.manageTags')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive"
                        >
                            {t('items.actions.delete')}
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('items.deleteConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('items.deleteWarning')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteItem(item.id)}>
                                {t('common.delete')}
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
    onManageTags: (item: ItemResponse) => void,
    t?: (key: string, options?: any) => string // Add translation function parameter
): ColumnDef<ItemResponse>[] {
    // Use t if provided, otherwise use a placeholder function that returns the key
    const translate = t || ((key: string) => key)

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={translate("items.columns.name")} />
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
                <DataTableColumnHeader column={column} title={translate("items.columns.categories")} />
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
            accessorKey: "tags",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={translate("items.columns.tags")} />
            ),
            cell: ({ row }) => {
                const tags = row.getValue("tags") as ItemResponse["tags"]
                return (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {tags.length > 0 ? (
                            tags.slice(0, 3).map((tag) => (
                                <Badge key={tag.id} variant="outline">
                                    {tag.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">
                              {translate("items.columns.none")}
                            </span>
                        )}
                        {tags.length > 3 && (
                            <Badge variant="outline">
                              +{tags.length - 3} {translate("items.columns.more")}
                            </Badge>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "avg_rating",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={translate("items.columns.rating")} />
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
                <DataTableColumnHeader column={column} title={translate("items.columns.created")} />
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
                        t={translate}
                    />
                )
            },
        },
    ]
}
