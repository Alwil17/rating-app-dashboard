'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { Category } from "@/schema/category.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { getCategoryColumns } from "./components/columns";
import { toast } from "sonner";
import { useDeleteCategoryMutation } from "@/hooks/queries/use-category.query";
import { CategoryFormModal } from "./components/category-form-modal";

export default function AdmincategoriesPage() {
    const { setPageTitle } = useBreadcrumb();
    const queryClient = useQueryClient();
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const deleteMutation = useDeleteCategoryMutation();

    useEffect(() => {
        setPageTitle('categories Management');
    }, [setPageTitle]);

    const { data: categories, isLoading, error } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        }
    });

    // Modal handlers
    const handleAddNew = () => {
        setEditingCategory(null);
        setCategoryModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        deleteMutation.mutate(category.id, {
            onSuccess: () => {
                toast.success(`${category.name} has been deleted successfully`);
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
            onError: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
        });
    };

    const handleCategorySuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-destructive">Error loading categories list</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Categories Management"
                subtitle="Manage and organize your categories"
                action={{
                    label: "Add new category",
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
                        columns={getCategoryColumns(handleEditCategory, handleDeleteCategory)}
                        data={categories || []}
                    />
                )}
            </div>

            <CategoryFormModal
                open={categoryModalOpen}
                onOpenChange={setCategoryModalOpen}
                initialData={editingCategory}
                onSuccess={handleCategorySuccess}
            />
        </div>
    );
}