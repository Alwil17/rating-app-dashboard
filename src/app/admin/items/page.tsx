'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/datatable";
import { ItemResponse } from "@/schema/item.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import { getItemColumns } from "./components/columns";
import { ItemForm } from "./components/item-form";
import { ItemDetails } from "./components/item-details";
import { useDeleteItemMutation } from "@/hooks/queries/use-item.query";
import { CategoryManager } from "./components/category-manager";
import { TagManager } from "./components/tag-manager";
import { TableSkeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export default function AdminItemsPage() {
  const { t } = useTranslation();
  const { setPageTitle } = useBreadcrumb();
  const queryClient = useQueryClient();
  
  // Item states
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  
  // Queries and mutations
  const { data: items, isLoading, error } = useQuery<ItemResponse[]>({
      queryKey: ['items'],
      queryFn: async () => {
          const response = await api.get('/items');
          return response.data;
      }
  });
  
  const deleteMutation = useDeleteItemMutation();

  useEffect(() => {
      setPageTitle(t('navigation.items'));
  }, [setPageTitle, t]);

  // Action handlers
  const handleAddNew = () => {
      setSelectedItem(null);
      setFormOpen(true);
  };

  const handleViewDetails = (item: ItemResponse) => {
      setSelectedItem(item);
      setDetailsOpen(true);
  };

  const handleEditItem = (item: ItemResponse) => {
      setSelectedItem(item);
      setFormOpen(true);
  };

  const handleManageCategories = (item: ItemResponse) => {
      setSelectedItem(item);
      setCategoryManagerOpen(true);
  };

  const handleManageTags = (item: ItemResponse) => {
      setSelectedItem(item);
      setTagManagerOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
      deleteMutation.mutate(itemId, {
          onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['items'] });
          }
      });
  };

  const handleSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
  };

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
              title={t('items.title')}
              subtitle={t('items.subtitle')}
              action={{
                  label: t('items.addItem'),
                  onClick: handleAddNew,
              }}
          />
          
          <div className="container mx-auto py-10">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <DataTable 
                  columns={getItemColumns(
                      handleViewDetails,
                      handleEditItem,
                      handleDeleteItem,
                      handleManageCategories,
                      handleManageTags
                  )} 
                  data={items || []}
                  searchColumn="name"
              />
            )}
          </div>

          {/* Dialogs */}
          <ItemForm 
              open={formOpen}
              onOpenChange={setFormOpen}
              initialData={selectedItem}
              onSuccess={handleSuccess}
          />

          <ItemDetails 
              item={selectedItem}
              open={detailsOpen}
              onOpenChange={setDetailsOpen}
          />

          <CategoryManager 
              item={selectedItem}
              open={categoryManagerOpen}
              onOpenChange={setCategoryManagerOpen}
              onSuccess={handleSuccess}
          />

          <TagManager 
              item={selectedItem}
              open={tagManagerOpen}
              onOpenChange={setTagManagerOpen}
              onSuccess={handleSuccess}
          />
      </div>
  );
}