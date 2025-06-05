"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle 
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
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/schema/rating.schema";
import { useState } from "react";
import { useCreateRatingMutation, useUpdateRatingMutation } from "@/hooks/queries/use-rating.query";

const formSchema = z.object({
  value: z.number().min(0).max(5),
  comment: z.string().nullable().optional(),
  item_id: z.number(),
  user_id: z.number(),
});

type RatingFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Rating | null;
  onSuccess?: () => void;
};

export function RatingForm({ open, onOpenChange, initialData, onSuccess }: Readonly<RatingFormProps>) {
  const isEditing = !!initialData;
  const [rating, setRating] = useState(initialData?.value ?? 0);
  
  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation(initialData?.id ?? 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialData?.value ?? 0,
      comment: initialData?.comment ?? "",
      item_id: initialData?.item_id ?? 0,
      user_id: initialData?.user_id ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { 
          ratingUpdate: { value: data.value, comment: data.comment ?? null }, 
          rating: initialData 
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
          value: data.value, 
          comment: data.comment ?? null,
          item_id: data.item_id,
          user_id: data.user_id,
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

  const isLoading = createMutation.isPending ?? updateMutation.isPending;

  const StarInput = ({ index }: { index: number }) => (
    <button
      type="button"
      onClick={() => {
        setRating(index);
        form.setValue("value", index);
      }}
      className="focus:outline-none"
    >
      <svg
        className={`w-6 h-6 ${
          index <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Rating" : "Add Rating"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <StarInput key={index} index={index} />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your comment here..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item ID</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
