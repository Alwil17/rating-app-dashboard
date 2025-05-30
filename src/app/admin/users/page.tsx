'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { UserResponse } from "@/schema/user.schema";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { getUserColumns } from "./components/columns";
import { UserDetailsModal } from "./components/user-details-modal";
import { AdminFormModal } from "./components/admin-form-modal";

export default function AdminUsersPage() {
    const { setPageTitle } = useBreadcrumb();
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<UserResponse | null>(null);

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

    const handleSubmitAdmin = (data: { name: string; email: string }) => {
        if (editingAdmin) {
            console.log('Update user', editingAdmin.id, data);
            // Make PUT / PATCH request here
        } else {
            console.log('Create new admin', data);
            // Make POST request here
        }
        setAdminModalOpen(false);
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
                        columns={getUserColumns((user) => setSelectedUser(user), handleEditUser)}
                        data={users || []}
                        meta={{
                            onViewDetails: (user: UserResponse) => setSelectedUser(user)
                        }}
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
            />
        </div>
    );
}