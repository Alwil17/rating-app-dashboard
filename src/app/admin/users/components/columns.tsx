"use client"

import { UserResponse } from "@/schema/user.schema"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header"

interface ActionsProps {
  user: UserResponse
  onViewDetails: (user: UserResponse) => void,
  onEditUser: (user: UserResponse) => void
}

const Actions = ({ user, onViewDetails, onEditUser }: ActionsProps) => {

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id.toString())}>
          Copy ID
        </DropdownMenuItem>
        {/* Only show if user is not admin */}
        {user.role === 'user' && (
          <DropdownMenuItem onClick={() => onViewDetails(user)}>View details</DropdownMenuItem>
        )}
        {/* Only show if user is admin */}
        {user.role === 'admin' && (
          <DropdownMenuItem onClick={() => onEditUser(user)}>
            Edit user
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function getUserColumns(
  onViewDetails: (user: UserResponse) => void,
  onEditUser: (user: UserResponse) => void
): ColumnDef<UserResponse>[] {

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.image_url ?? undefined} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      )
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{role || "user"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joined" />
      ),
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const user = row.original
        // @ts-ignore - Custom table meta
        const { onViewDetails } = table.options.meta || {}

        return <Actions user={user} onViewDetails={onViewDetails} onEditUser={onEditUser} />
      },
    },
  ];
}

