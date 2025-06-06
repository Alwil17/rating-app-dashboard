'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { UserResponse } from "@/schema/user.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { getUserColumns } from "./components/columns";
import { UserDetailsModal } from "./components/user-details-modal";
import { AdminFormModal } from "./components/admin-form-modal";
import { toast } from "sonner";
import { useDeleteUserMutation, useResetPasswordMutation } from "@/hooks/queries/use-admin.query";
import { ResetPasswordDialog } from "./components/reset-password-dialog";

export default function AdminUsersPage() {
    const { setPageTitle } = useBreadcrumb();
    const queryClient = useQueryClient();
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<UserResponse | null>(null);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [resetPasswordUser, setResetPasswordUser] = useState<UserResponse | null>(null);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    
    const deleteMutation = useDeleteUserMutation();
    const resetPasswordMutation = useResetPasswordMutation();

    useEffect(() => {
        setPageTitle('Users Management');
    }, [setPageTitle]);

    const { data: users, isLoading, error } = useQuery<UserResponse[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        }
    });

    // Modal handlers
    const handleAddNew = () => {
        setEditingAdmin(null);
        setAdminModalOpen(true);
    };

    const handleEditUser = (user: UserResponse) => {
        setEditingAdmin(user);
        setAdminModalOpen(true);
    };

    const handleDeleteUser = (user: UserResponse) => {
        deleteMutation.mutate(user.id, {
            onSuccess: () => {
                toast.success(`${user.name} has been deleted successfully`);
                queryClient.invalidateQueries({ queryKey: ['users'] });
                setSelectedUser(null);
            },
            onError: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                setSelectedUser(null);
            },
        });
    };

    const handleResetPassword = (user: UserResponse) => {
        setResetPasswordUser(user);
        setTempPassword(null);
        setResetPasswordOpen(true);
    };

    const confirmResetPassword = () => {
        if (resetPasswordUser) {
            resetPasswordMutation.mutate(resetPasswordUser.id, {
                onSuccess: (data) => {
                    setTempPassword(data.tempPassword);
                },
            });
        }
    };

    const handleAdminSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-destructive">Error loading users list</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Users Management"
                subtitle="Manage and organize your users"
                action={{
                    label: "Add new admin",
                    onClick: handleAddNew,
                }}
            />

            <div className="container mx-auto py-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <DataTable
                        columns={getUserColumns(
                            (user) => setSelectedUser(user),
                            handleEditUser,
                            handleDeleteUser,
                            handleResetPassword
                        )}
                        data={users || []}
                    />
                )}
            </div>

            <UserDetailsModal
                user={selectedUser}
                open={!!selectedUser}
                onOpenChange={(open) => !open && setSelectedUser(null)}
            />

            <AdminFormModal
                open={adminModalOpen}
                onOpenChange={setAdminModalOpen}
                initialData={editingAdmin}
                onSuccess={handleAdminSuccess}
            />

            <ResetPasswordDialog
                open={resetPasswordOpen}
                onOpenChange={setResetPasswordOpen}
                user={resetPasswordUser}
                isLoading={resetPasswordMutation.isPending}
                tempPassword={tempPassword}
                onConfirm={confirmResetPassword}
            />
        </div>
    );
}