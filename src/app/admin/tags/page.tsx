'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { Tag } from "@/schema/tag.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { getTagColumns } from "./components/columns";
import { toast } from "sonner";
import { useDeleteTagMutation } from "@/hooks/queries/use-tag.query";
import { TagFormModal } from "./components/tag-form-modal";

export default function AdmintagsPage() {
    const { setPageTitle } = useBreadcrumb();
    const queryClient = useQueryClient();
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const deleteMutation = useDeleteTagMutation();

    useEffect(() => {
        setPageTitle('Tags Management');
    }, [setPageTitle]);

    const { data: tags, isLoading, error } = useQuery<Tag[]>({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await api.get('/tags');
            return response.data;
        }
    });

    // Modal handlers
    const handleAddNew = () => {
        setEditingTag(null);
        setTagModalOpen(true);
    };

    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag);
        setTagModalOpen(true);
    };

    const handleDeleteTag = (tag: Tag) => {
        deleteMutation.mutate(tag.id, {
            onSuccess: () => {
                toast.success(`${tag.name} has been deleted successfully`);
                queryClient.invalidateQueries({ queryKey: ['tags'] });
            },
            onError: () => {
                queryClient.invalidateQueries({ queryKey: ['tags'] });
            },
        });
    };

    const handleTagSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['tags'] });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-destructive">Error loading tags list</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Tags Management"
                subtitle="Manage and organize your tags"
                action={{
                    label: "Add new tag",
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
                        columns={getTagColumns(handleEditTag, handleDeleteTag)}
                        data={tags || []}
                    />
                )}
            </div>

            <TagFormModal
                open={tagModalOpen}
                onOpenChange={setTagModalOpen}
                initialData={editingTag}
                onSuccess={handleTagSuccess}
            />
        </div>
    );
}