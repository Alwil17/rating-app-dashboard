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
import { Star } from "lucide-react";

export default function AdminRatingsPage() {
    const { setPageTitle } = useBreadcrumb();
    const queryClient = useQueryClient();
    const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    
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
            />
        </div>
    );
}
