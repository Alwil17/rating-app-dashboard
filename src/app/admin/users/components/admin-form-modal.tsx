"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAdminMutation, useUpdateAdminMutation } from "@/hooks/queries/use-admin.query";
import { UserResponse } from "@/schema/user.schema";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
  role: z.string(),
  image_url: z.string().url().optional().or(z.literal('')),
});

type AdminFormValues = z.infer<typeof formSchema>;

type AdminFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: UserResponse | null;
  onSuccess?: () => void;
};

export function AdminFormModal({ open, onOpenChange, initialData, onSuccess }: Readonly<AdminFormModalProps>) {
  const { t } = useTranslation();
  const createMutation = useCreateAdminMutation();
  const updateMutation = useUpdateAdminMutation(initialData?.id || 0);
  
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "", // Don't prefill password
      role: "admin",
      image_url: initialData?.image_url || "",
    },
  });

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        email: initialData?.email || "",
        password: "", // Don't prefill password
        role: "admin",
        image_url: initialData?.image_url || "",
      });
    }
  }, [open, initialData, form]);

  const onSubmit = (data: AdminFormValues) => {
    // If password is empty and editing, remove it from payload
    if (initialData && !data.password) {
      const { password, ...rest } = data;
      updateMutation.mutate(rest, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
    } else {
      if (initialData) {
        updateMutation.mutate(data, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        });
      } else {
        createMutation.mutate(
          {
            ...data,
            password: data.password ?? "",
          },
          {
            onSuccess: () => {
              onOpenChange(false);
              onSuccess?.();
            },
          }
        );
      }
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('users.form.editTitle', { name: initialData.name })
              : t('users.form.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('users.form.namePlaceholder')} {...field} />
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
                  <FormLabel>{t('users.form.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('users.form.emailPlaceholder')} {...field} />
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
                  <FormLabel>
                    {t(isEditing ? 'users.form.passwordLabelOptional' : 'users.form.passwordLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('users.form.passwordPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.imageUrlLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('users.form.imageUrlPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('common.save') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
