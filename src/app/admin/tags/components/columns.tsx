"use client"

import { useAuth } from "@/contexts/auth.context";
import { Tag } from "@/schema/tag.schema";
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
    tag: Tag,
    onEditTag: (tag: Tag) => void,
    onDeleteTag: (tag: Tag) => void
}

const Actions = ({ tag, onEditTag, onDeleteTag }: ActionsProps) => {
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tag.id.toString())}>
                    Copy ID
                </DropdownMenuItem>
                {/* Only show edit option if user is admin */}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onEditTag(tag)}>
                        Edit tag
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
                                    Cette action est irréversible. Cela supprimera définitivement le tag.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteTag(tag)}>Confirmer</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function getTagColumns(
    onEditTag: (tag: Tag) => void,
    onDeleteTag: (tag: Tag) => void
): ColumnDef<Tag>[] {

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const tag = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="font-medium">{tag.name}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            id: "actions",

            cell: ({ row }) => {
                const tag = row.original
                return <Actions tag={tag} onEditTag={onEditTag} onDeleteTag={onDeleteTag} />
            },
        },
    ];
}

