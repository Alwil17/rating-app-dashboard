'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCreate, userCreateSchema, userUpdateSchema, UserResponse, UserUpdate } from '@/schema/user.schema';
import { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAdminMutation, useUpdateAdminMutation } from '@/hooks/queries/use-admin.query';
import { Loader2 } from 'lucide-react';
interface AdminFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: UserResponse | null;
}

export function AdminFormModal({ open, onOpenChange, initialData }: Readonly<AdminFormModalProps>) {
    const isEdit = !!initialData;

    const createMutation = useCreateAdminMutation();
    const updateMutation = useUpdateAdminMutation(initialData?.id ?? 0);
    // Use the appropriate mutation based on whether we're editing or creating
    // If initialData is provided, we are editing; otherwise, we are creating
    const mutation = isEdit ? updateMutation : createMutation;

    const form = useForm<UserCreate | UserUpdate>({
        resolver: zodResolver(isEdit ? userUpdateSchema : userCreateSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                password: '', // leave empty for edit
            });
        } else {
            form.reset({
                name: '',
                email: '',
                password: '',
            });
        }
    }, [initialData, form]);

    const onSubmit = (data: UserCreate | UserUpdate) => {
        if (initialData) {
            updateMutation.mutate(data as UserUpdate);
        } else {
            createMutation.mutate(data as UserCreate);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Admin' : 'Create Admin'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
