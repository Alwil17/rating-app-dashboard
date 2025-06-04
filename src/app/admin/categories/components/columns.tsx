"use client"

import { useAuth } from "@/contexts/auth.context";
import { Category } from "@/schema/category.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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

interface ActionsProps {
    category: Category,
    onEditCategory: (category: Category) => void,
    onDeleteCategory: (category: Category) => void
}

const Actions = ({ category, onEditCategory, onDeleteCategory }: ActionsProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id.toString())}>
                    Copy ID
                </DropdownMenuItem>
                {/* Only show edit option if user is admin */}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onEditCategory(category)}>
                        Edit category
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {/* Only show delete option if user is admin */}
                {isAdmin && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                Supprimer
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Cela supprimera définitivement la catégorie.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteCategory(category)}>Confirmer</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function getCategoryColumns(
    onEditCategory: (category: Category) => void,
    onDeleteCategory: (category: Category) => void
): ColumnDef<Category>[] {

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const category = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="font-medium">{category.name}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Description" />
            )
        },
        {
            id: "actions",

            cell: ({ row }) => {
                const category = row.original
                return <Actions category={category} onEditCategory={onEditCategory} onDeleteCategory={onDeleteCategory} />
            },
        },
    ];
}

