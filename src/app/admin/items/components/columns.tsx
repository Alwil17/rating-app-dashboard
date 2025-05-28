"use client"

import { ItemResponse } from "@/schema/item.schema"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header"

// This type is used to define the shape of our data.
export const columns: ColumnDef<ItemResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        )

    },
    {
        accessorKey: "categories",
        header: "Categories",
        cell: ({ row }) => {
            const categories = row.getValue("categories") as ItemResponse["categories"]
            return (
                <div className="flex gap-1">
                    {categories.map((category) => (
                        <Badge key={category.id} variant="outline">
                            {category.name}
                        </Badge>
                    ))}
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
                    <Star className="h-4 w-4 fill-primary text-primary" />
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id.toString())}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
