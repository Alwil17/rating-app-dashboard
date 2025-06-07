"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ItemResponse } from "@/schema/item.schema";
import { useEffect } from "react";
import { useCreateItemMutation, useUpdateItemMutation } from "@/hooks/queries/use-item.query";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  name: z.string().min(1).max(200, "Name must be 200 characters or less"),
  description: z.string().nullable().optional(),
  image_url: z.string().url("Must be a valid URL").nullable().optional(),
});

type ItemFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ItemResponse | null;
  onSuccess?: () => void;
};

export function ItemForm({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Readonly<ItemFormProps>) {
  const { t } = useTranslation();
  const isEditing = !!initialData;
  
  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation(initialData?.id || 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
    },
  });

  // Reset form with initial data when opened or when initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          description: initialData.description || "",
          image_url: initialData.image_url || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
          image_url: "",
        });
      }
    }
  }, [initialData, open, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        {
          name: data.name,
          description: data.description || null,
          image_url: data.image_url || null,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: data.name,
          description: data.description || null,
          image_url: data.image_url || null,
          category_ids: [],
          tags: [],
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
            onSuccess?.();
          },
        }
      );
    }
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('items.form.editTitle') : t('items.form.createTitle')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('items.form.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('items.form.fields.name.placeholder')} {...field} />
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
                  <FormLabel>{t('items.form.fields.description.label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('items.form.fields.description.placeholder')}
                      className="resize-none min-h-[100px]"
                      {...field}
                      value={field.value || ""}
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
                  <FormLabel>{t('items.form.fields.imageUrl.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('items.form.fields.imageUrl.placeholder')} 
                      {...field}
                      value={field.value || ""}
                    />
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
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('common.save') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
