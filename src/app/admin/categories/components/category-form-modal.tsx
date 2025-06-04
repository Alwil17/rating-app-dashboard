'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, categoryCreateSchema, categoryUpdateSchema, CategoryCreate, CategoryUpdate } from '@/schema/category.schema';
import { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/hooks/queries/use-category.query';
import { Loader2 } from 'lucide-react';
interface CategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Category | null;
    onSuccess?: () => void;
}

export function CategoryFormModal({ open, onOpenChange, initialData, onSuccess }: Readonly<CategoryFormModalProps>) {
    const isEdit = !!initialData;

    const createMutation = useCreateCategoryMutation();
    const updateMutation = useUpdateCategoryMutation(initialData?.id ?? 0);
    // Use the appropriate mutation based on whether we're editing or creating
    // If initialData is provided, we are editing; otherwise, we are creating
    const mutation = isEdit ? updateMutation : createMutation;

    const form = useForm<CategoryCreate | CategoryUpdate>({
        resolver: zodResolver(isEdit ? categoryUpdateSchema : categoryCreateSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description,
            });
        } else {
            form.reset({
                name: '',
                description: ''
            });
        }
    }, [initialData, form]);

    const onSubmit = (data: CategoryCreate | CategoryUpdate) => {
        if (isEdit) {
            updateMutation.mutate(data as CategoryUpdate, {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.(); // trigger refetch
                },
            });
        } else {
            createMutation.mutate(data as CategoryCreate, {
                onSuccess: () => {
                    form.reset({
                        name: '',
                        description: ''
                    });
                    onOpenChange(false);
                    onSuccess?.(); // trigger refetch
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Books" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category for all books" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Category' : 'Create Category'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
