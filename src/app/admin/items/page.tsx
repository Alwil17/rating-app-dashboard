'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./components/columns";
import { ItemResponse } from "@/schema/item.schema";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Package } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminItemsPage() {
    const { setPageTitle } = useBreadcrumb();
    
    const { data: items, isLoading, error } = useQuery<ItemResponse[]>({
        queryKey: ['items'],
        queryFn: async () => {
            const response = await api.get('/items');
            return response.data;
        }
    });

    useEffect(() => {
        setPageTitle('Items Management');
    }, [setPageTitle]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-destructive">Error loading items</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Items Management"
                subtitle="Manage and organize your items catalog"
                action={{
                    label: "Add Item",
                    onClick: () => console.log("Add item clicked"),
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
                        data={items || []} 
                    />
                )}
            </div>
        </div>
    );
}