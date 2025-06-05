'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { Rating } from "@/schema/rating.schema";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getRatingColumns } from "./components/columns";
import { useRatings, useDeleteRatingMutation } from "@/hooks/queries/use-rating.query";
import { RatingDetails } from "./components/rating-details";
import { ItemDetailsModal } from "./components/item-details-modal";
import { UserDetailsModal } from "./components/user-details-modal";

export default function AdminRatingsPage() {
    const { setPageTitle } = useBreadcrumb();
    const queryClient = useQueryClient();
    const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userModalOpen, setUserModalOpen] = useState(false);
    
    const { data: ratings, isLoading, error } = useRatings();
    const deleteMutation = useDeleteRatingMutation();

    useEffect(() => {
        setPageTitle('Ratings Management');
    }, [setPageTitle]);

    // Action handlers

    const handleViewDetails = (rating: Rating) => {
        setSelectedRating(rating);
        setDetailsOpen(true);
    };

    const handleViewItem = (itemId: number) => {
        setSelectedItemId(itemId);
        setItemModalOpen(true);
    };

    const handleViewUser = (userId: number) => {
        setSelectedUserId(userId);
        setUserModalOpen(true);
    };

    const handleDeleteRating = (rating: Rating) => {
        deleteMutation.mutate(rating);
    };

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['ratings'] });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-destructive">Error loading ratings</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Ratings Management"
                subtitle="View and manage user ratings"
            />

            <div className="container mx-auto py-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <DataTable
                        columns={getRatingColumns(
                            handleViewDetails,
                            handleViewItem,
                            handleViewUser,
                            handleDeleteRating
                        )}
                        data={ratings || []}
                    />
                )}
            </div>

            <RatingDetails
                rating={selectedRating}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                onViewItem={handleViewItem}
                onViewUser={handleViewUser}
            />

            <ItemDetailsModal
                itemId={selectedItemId}
                open={itemModalOpen}
                onOpenChange={setItemModalOpen}
            />

            <UserDetailsModal
                userId={selectedUserId}
                open={userModalOpen}
                onOpenChange={setUserModalOpen}
            />
        </div>
    );
}
