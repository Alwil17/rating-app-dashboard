"use client"

import { UserResponse } from "@/schema/user.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, KeyRound } from "lucide-react";
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
import { useTranslation } from "react-i18next";

interface ActionsProps {
  user: UserResponse
  onViewDetails: (user: UserResponse) => void,
  onEditUser: (user: UserResponse) => void,
  onDeleteUser: (user: UserResponse) => void,
  onResetPassword: (user: UserResponse) => void,
  t: (key: string, options?: any) => string
}

const Actions = ({ 
  user, 
  onViewDetails, 
  onEditUser, 
  onDeleteUser,
  onResetPassword,
  t
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id.toString())}>
          {t('users.actions.copyId')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewDetails(user)}>{t('users.actions.viewDetails')}</DropdownMenuItem>
        {/* Only show if user is admin */}
        {user.role === 'admin' && (
          <DropdownMenuItem onClick={() => onEditUser(user)}>
            {t('users.actions.edit')}
          </DropdownMenuItem>
        )}
        
        {/* Reset password option */}
        {user.role === 'user' && (
          <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <KeyRound className="h-4 w-4 mr-2" />
          {t('users.resetPassword')}
        </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                {t('common.delete')}
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('users.deleteConfirm')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('users.deleteWarning')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteUser(user)}>{t('common.confirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function getUserColumns(
  onViewDetails: (user: UserResponse) => void,
  onEditUser: (user: UserResponse) => void,
  onDeleteUser: (user: UserResponse) => void,
  onResetPassword: (user: UserResponse) => void,
  t?: (key: string, options?: any) => string
): ColumnDef<UserResponse>[] {
  const translate = t || ((key: string) => key);

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={translate("users.columns.name")} />
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
        <DataTableColumnHeader column={column} title={translate("users.columns.email")} />
      )
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={translate("users.columns.role")} />
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
        <DataTableColumnHeader column={column} title={translate("users.columns.joined")} />
      ),
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return <Actions 
                  user={user} 
                  onViewDetails={onViewDetails} 
                  onEditUser={onEditUser} 
                  onDeleteUser={onDeleteUser} 
                  onResetPassword={onResetPassword}
                  t={translate} 
               />;
      },
    },
  ];
}

