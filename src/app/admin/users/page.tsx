'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { UserResponse } from "@/schema/user.schema";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { columns } from "./components/columns";
import { UserDetailsModal } from "./components/user-details-modal";

export default function AdminUsersPage() {
    const { setPageTitle } = useBreadcrumb();
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    
    const { data: users, isLoading, error } = useQuery<UserResponse[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        }
    });

    useEffect(() => {
        setPageTitle('Users Management');
    }, [setPageTitle]);

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
                    onClick: () => console.log("Add user clicked"),
                }}
            />
            
            <div className="container mx-auto py-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
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
        </div>
    );
}