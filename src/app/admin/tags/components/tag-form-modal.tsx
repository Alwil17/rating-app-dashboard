'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, tagCreateSchema, tagUpdateSchema, TagCreate, TagUpdate } from '@/schema/tag.schema';
import { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTagMutation, useUpdateTagMutation } from '@/hooks/queries/use-tag.query';
import { Loader2 } from 'lucide-react';
interface TagFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Tag | null;
    onSuccess?: () => void;
}

export function TagFormModal({ open, onOpenChange, initialData, onSuccess }: Readonly<TagFormModalProps>) {
    const isEdit = !!initialData;

    const createMutation = useCreateTagMutation();
    const updateMutation = useUpdateTagMutation(initialData?.id ?? 0);
    // Use the appropriate mutation based on whether we're editing or creating
    // If initialData is provided, we are editing; otherwise, we are creating
    const mutation = isEdit ? updateMutation : createMutation;

    const form = useForm<TagCreate | TagUpdate>({
        resolver: zodResolver(isEdit ? tagUpdateSchema : tagCreateSchema),
        defaultValues: {
            name: ''
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name
            });
        } else {
            form.reset({
                name: ''
            });
        }
    }, [initialData, form]);

    const onSubmit = (data: TagCreate | TagUpdate) => {
        if (isEdit) {
            updateMutation.mutate(data as TagUpdate, {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.(); // trigger refetch
                },
            });
        } else {
            createMutation.mutate(data as TagCreate, {
                onSuccess: () => {
                    form.reset({
                        name: ''
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
                    <DialogTitle>{initialData ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Books" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Tag' : 'Create Tag'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
